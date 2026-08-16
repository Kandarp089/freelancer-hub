import razorpay
from django.conf import settings
import hmac
import hashlib

def get_razorpay_client():
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

def create_razorpay_order(amount_in_rupees, currency="INR", receipt=None):
    client = get_razorpay_client()
    amount_in_paise = int(amount_in_rupees * 100)
    data = {
        "amount": amount_in_paise,
        "currency": currency,
        "receipt": receipt or "receipt_order",
        "payment_capture": 1
    }
    return client.order.create(data=data)

def verify_razorpay_signature(order_id, payment_id, signature):
    key_secret = settings.RAZORPAY_KEY_SECRET.encode('utf-8')
    msg = f"{order_id}|{payment_id}".encode('utf-8')
    generated_signature = hmac.new(key_secret, msg, hashlib.sha256).hexdigest()
    return hmac.compare_digest(generated_signature, signature)
