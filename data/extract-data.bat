if exist "C:\data" (
    rmdir /s /q "C:\data"
)

tar -xf data.zip -C C:\
pause