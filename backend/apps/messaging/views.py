from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

User = get_user_model()

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all().prefetch_related('members', 'messages')
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset().filter(members=self.request.user)

    @action(detail=False, methods=['post'])
    def start_or_get(self, request):
        recipient_id = request.data.get('recipient_id')
        project_id = request.data.get('project_id')

        if not recipient_id:
            return Response({'error': 'recipient_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            return Response({'error': 'Recipient user not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check existing conversation
        existing = Conversation.objects.filter(members=request.user).filter(members=recipient)
        if project_id:
            existing = existing.filter(project_id=project_id)

        if existing.exists():
            conversation = existing.first()
        else:
            conversation = Conversation.objects.create(project_id=project_id if project_id else None)
            conversation.members.add(request.user, recipient)

        serializer = self.get_serializer(conversation)
        return Response(serializer.data, status=status.HTTP_200_OK)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().select_related('sender')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.request.query_params.get('conversation')
        if conversation_id:
            return super().get_queryset().filter(conversation_id=conversation_id, conversation__members=self.request.user)
        return super().get_queryset().filter(conversation__members=self.request.user)

    def perform_create(self, serializer):
        message = serializer.save(sender=self.request.user)
        message.conversation.save() # Update conversation updated_at

    @action(detail=False, methods=['post'])
    def mark_read(self, request):
        conversation_id = request.data.get('conversation_id')
        if conversation_id:
            Message.objects.filter(conversation_id=conversation_id).exclude(sender=request.user).update(is_read=True)
            return Response({'status': 'messages marked as read'})
        return Response({'error': 'conversation_id required'}, status=status.HTTP_400_BAD_REQUEST)
