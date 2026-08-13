#!/bin/sh
MAVEN_VERSION=3.9.11
MAVEN_HOME="$HOME/.farm-maven/apache-maven-$MAVEN_VERSION"
if [ ! -x "$MAVEN_HOME/bin/mvn" ]; then
  echo "Maven not found. Please run mvnw.cmd on Windows, or install Maven on Unix-like systems."
  exit 1
fi
exec "$MAVEN_HOME/bin/mvn" "$@"
