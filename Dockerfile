FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY TarefasAPI/*.csproj ./TarefasAPI/
RUN dotnet restore TarefasAPI/TarefasAPI.csproj

COPY TarefasAPI/. ./TarefasAPI/
WORKDIR /app/TarefasAPI
RUN dotnet publish -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "TarefasAPI.dll"]