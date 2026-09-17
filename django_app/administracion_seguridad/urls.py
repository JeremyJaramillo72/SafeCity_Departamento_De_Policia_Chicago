from django.urls import path
from .views import (
    LoginView, ForceLogoutView, LogoutView, UserListView, AuditLogListView, AuditLogExportView,
    BackupListCreateView, BackupDownloadView, BackupRestoreView,
    PasswordResetRequestView, PasswordResetConfirmView, PasswordChangeView,
    SystemCategoriesView, SystemCategoryDetailView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('force-logout/<int:id_usuario>/', ForceLogoutView.as_view(), name='force-logout'),
    path('users/', UserListView.as_view(), name='users-list'),
    path('logs/', AuditLogListView.as_view(), name='audit-logs-list'),
    path('logs/export/', AuditLogExportView.as_view(), name='audit-logs-export'),
    
    # Adiciones de Ciberseguridad
    path('backups/', BackupListCreateView.as_view(), name='backups-list-create'),
    path('backups/<str:backup_name>/download/', BackupDownloadView.as_view(), name='backup-download'),
    path('backups/<str:backup_name>/restore/', BackupRestoreView.as_view(), name='backup-restore'),
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('password-change/', PasswordChangeView.as_view(), name='password-change'),
    
    # Módulo de Categorías del Sistema
    path('categories/', SystemCategoriesView.as_view(), name='system-categories'),
    path('categories/<int:id_catalogo>/', SystemCategoryDetailView.as_view(), name='system-category-detail'),
]


