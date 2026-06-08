from rest_framework.versioning import URLPathVersioning

class CustomVersioning(URLPathVersioning):
    allowed_versions = ['v1', 'v2']
    default_version = 'v1'
    version_param = 'version'
