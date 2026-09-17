import contextvars

# Create a ContextVar to store the current HTTP request object
_current_request = contextvars.ContextVar('current_request', default=None)

def get_current_request():
    return _current_request.get()

class CurrentRequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = _current_request.set(request)
        try:
            response = self.get_response(request)
            return response
        finally:
            _current_request.reset(token)
