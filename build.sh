#!/bin/bash
npm --prefix ./frontend run build
cp ./frontend/dist/kaleidoscope-frontend/* ./kaleidoscope-backend/src/main/resources/static
mvn -f kaleidoscope-backend/ clean package