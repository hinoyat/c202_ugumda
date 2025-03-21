FROM openjdk:21
WORKDIR /app
COPY target/*.jar lucky-service.jar
EXPOSE 8080
# 나중에 필요시 MySQL 연결 환경변수 추가할 수 있음
ENTRYPOINT ["java", "-jar", "lucky-service.jar"]