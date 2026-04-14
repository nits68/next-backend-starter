if not exist "c:\data\" mkdir "c:\data"
if not exist "c:\data\db" mkdir "c:\data\db"
mongod --dbpath="c:\data\db" --replSet "rs0"
