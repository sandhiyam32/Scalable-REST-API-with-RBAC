from rest_framework.views import exception_handler
from rest_framework.response import Response


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return response

    # Normalize all errors into one consistent shape:
    # { "status": "error", "code": 400, "errors": { "field": ["message"] } }
    errors = response.data
    if isinstance(errors, dict):
        errors = {k: v if isinstance(v, list) else [v] for k, v in errors.items()}
    else:
        errors = {'detail': errors if isinstance(errors, list) else [errors]}

    response.data = {
        'status': 'error',
        'code':   response.status_code,
        'errors': errors,
    }
    return response
