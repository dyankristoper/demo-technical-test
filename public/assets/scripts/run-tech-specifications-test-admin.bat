@echo off

@REM Get current working directory
set myPath=%cd%

@REM Create Folder for all results
mkdir results\

powershell -Command "Start-Process -Verb RunAs powershell '-ExecutionPolicy Bypass -Command "^"" cd \\"^""%mypath%\"^""; & \\"^"".\run-tech-specifications-test.ps1\\"^"" "^""'"