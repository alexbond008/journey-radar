from pyfcm import FCMNotification

push_service = FCMNotification(api_key="TWÓJ_FIREBASE_SERVER_KEY")

def send_notification(token, title, body):
    result = push_service.notify_single_device(
        registration_id=token,
        message_title=title,
        message_body=body,
    )
    print(result)
