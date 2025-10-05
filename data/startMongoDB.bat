if not exist "c:\data\" mkdir "c:\data"
if not exist "c:\data\db" mkdir "c:\data\db"
"c:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath="c:\data\db" --replSet "rs0"
