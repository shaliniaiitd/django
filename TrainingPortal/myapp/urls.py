from django.urls import path
from . import views
from django.urls import path, include
from django.contrib.auth.models import User
# from rest_framework import routers, serializers, viewsets
#
# # Serializers define the API representation.
# class UserSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = User
#         fields = ['url', 'username', 'email', 'is_staff']
#
# # ViewSets define the view behavior.
# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

# Routers provide an easy way of automatically determining the URL conf.
# router = routers.DefaultRouter()
# router.register(r'users', UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
# urlpatterns = [
#     path('', include(router.urls)),
#     path('api-auth/', include('rest_framework.urls', namespace='rest_framework')) #login urls
# ]

urlpatterns = [path('',views.index,name='index'),
               #path('members/addimage/<int:id>', views.UploadImageUpdateView.as_view(), name = "image-request"),
               path('courses/',views.CoursesListView.as_view(),name = 'courses_list'),
               path('members/', views.MembersListView.as_view(), name='members_list'),
               path('courses/addcourse/', views.CourseCreateView.as_view(),name='addcourse'),
               path('courses/<pk>/detail/', views.CourseDetailView.as_view(), name='courses_detail'),

               path('members/detail/<pk>', views.MemberDetailView.as_view(), name='members_detail'),
               path('members/addmember/', views.MemberCreateView.as_view()  , name='addmember'),
               path('members/delete/<pk>', views.MemberDeleteView.as_view(), name='delete'),
               path('members/update/<pk>', views.MemberUpdateView.as_view(), name='update'),
               path('courses/<pk>/delete/', views.CourseDeleteView.as_view(), name='deletec'),
               path('courses/update/<pk>', views.CourseUpdateView.as_view(), name='updatecourse'),
               # path('courses/',views.courses,name='courses'),
               # path('add/', views.MemberCreateView.as_view, name='addmember'),
               # path('courses/update/<int:id>', views.updatec, name='updatec'),
               # path('members/update/updatemember/<int:id>', views.updatemember, name='updatemember'),

               ]