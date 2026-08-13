@echo off
setlocal
set MAVEN_VERSION=3.9.11
set MAVEN_HOME=%USERPROFILE%\.farm-maven\apache-maven-%MAVEN_VERSION%
if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
  echo Maven not found. Downloading Apache Maven %MAVEN_VERSION%...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$u='https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip'; $z=Join-Path $env:TEMP 'farm-maven.zip'; Invoke-WebRequest -Uri $u -OutFile $z; New-Item -ItemType Directory -Force -Path (Split-Path '%MAVEN_HOME%') | Out-Null; Expand-Archive -Path $z -DestinationPath (Split-Path '%MAVEN_HOME%') -Force; Remove-Item $z"
)
call "%MAVEN_HOME%\bin\mvn.cmd" %*
