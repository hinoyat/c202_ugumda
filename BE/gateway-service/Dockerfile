FROM openjdk:21
WORKDIR /app
COPY target/*.jar gateway-service.jar
EXPOSE 80
ENTRYPOINT ["java", "-jar", "gateway-service.jar"]