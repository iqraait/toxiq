from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ArticleSubmission
from .serializers import ArticleSubmissionSerializer, ArticleReviewSerializer
from authentication.permissions import IsAdminUserRole

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = ArticleSubmission.objects.all().order_by('-submitted_date')
    serializer_class = ArticleSubmissionSerializer

    def get_permissions(self):
        # Allow anyone to submit an article
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsAdminUserRole()]

    def get_queryset(self):
        queryset = ArticleSubmission.objects.all().order_by('-submitted_date')
        
        # Admin Filters
        search_query = self.request.query_params.get('search')
        status_query = self.request.query_params.get('status')
        
        if search_query:
            queryset = queryset.filter(
                article_title__icontains=search_query
            ) | queryset.filter(
                author_name__icontains=search_query
            ) | queryset.filter(
                registration__registration_id__icontains=search_query
            )
            
        if status_query:
            queryset = queryset.filter(status=status_query)
            
        return queryset

    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUserRole])
    def update_status(self, request, pk=None):
        """
        Custom action for Admin to moderate the status and add remarks.
        """
        article = self.get_object()
        serializer = ArticleReviewSerializer(article, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(ArticleSubmissionSerializer(article, context={'request': request}).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
