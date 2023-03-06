# Compiling Phase:
FROM mcr.microsoft.com/dotnet/sdk:6.0 as buildStage
# place where it compiles all the files:
WORKDIR /app 
# csproj contains all the dependencies for the application
COPY *.csproj ./ 
RUN dotnet restore
# copy all files to the current location
COPY . ./ 
# build the application; generate the output files in release mode under out folder
RUN dotnet publish -c Release -o out

# Running Phase:
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /deploy
#to create the Resources/Images folders
RUN mkdir -p /deploy/Resources/Images
#to copy the images within the Images folder into the one in deployment
COPY /Resources/Images/*.png /deploy/Resources/Images
# copying files from buildStage > /app/out/ folder
COPY --from=buildStage /app/out . 
ENTRYPOINT ["dotnet", "UserV2API.dll"]