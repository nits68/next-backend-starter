# Next.js-TS-Prisma-MongoDB REST API starter

https://www.prisma.io/docs/guides/nextjs

## 1. Projekt inicializálása a create-next-app sablonnal

> npx create-next-app@latest --api --eslint<br>

Majd interaktív lépések

> What is your project named? **next_api_starter**<br>
> Would you like to use TypeScript? No / **Yes**<br>
> Would you like your code inside a `src/` directory? **No** / Yes<br>
> Would you like to use Turbopack for `next dev`? **No** / Yes<br>
> Would you like to customize the import alias (`@/*` by default)? **No** / Yes<br>
> What import alias would you like configured? @/\*<br>

## 2. További külső csomagok telepítése, Prisma inicializálása

> npm i -D prisma typescript-eslint<br>
> npm i -g tsx<br>
> npm i @prisma/client<br>
> npx prisma init<br>

## 3. Prisma konfigurálása: ./prisma/schma.prisma

Output sor törlése:

> output = "../app/generated/prisma"<br>

MongoDB database-provider beállítása:

> provider = "mongodb"<br>

## 4. Konfigurációs állományok létrehozása, vagy másolása

.vscode/extensions.json (majd a VS Code indításakor a felajánlott bővítmények telepítése)

```
{
    "recommendations": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "prisma.prisma",
        "humao.rest-client"
    ]
}
```

.vscode/settings.json

```
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.mouseWheelZoom": true,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": false,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always"
  },
  "eslint.validate": ["typescript", "react", "typescriptreact", "javascript", "javascriptreact"],
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "git.pruneOnFetch": true,
  "git.autofetch": true,
  "git.autofetchPeriod": 60,
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  },
  "[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "javascript.preferences.importModuleSpecifier": "non-relative",
  "prisma.pinToPrisma6": true
}
```

.vscode/tasks.json

```
{
  // See https://go.microsoft.com/fwlink/?LinkId=733558
  // for the documentation about the tasks.json format
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "script": "dev",
      "group": {
        "kind": "build",
        "isDefault": true
      }
    },
    {
      "type": "npm",
      "script": "test",
      "group": {
        "kind": "test",
        "isDefault": true
      }
    }
  ]
}
```

eslint.config.mjs

```
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended, // Alap JavaScript ajánlott szabályok
  ...tseslint.configs.recommended, // TypeScript ajánlott szabályok

  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "*.config.js",
      "*.config.cjs",
      "*.config.mjs",
    ],
  },

  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // TypeScript best practices
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-explicit-any": "off",

      // Kód tisztaság
      "no-console": "warn",
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: "error",
    },
  },
];
```

prettier.config.ts

```
import { type Config } from "prettier";

const config: Config = {
  singleQuote: false,
  semi: true,
  trailingComma: "all",
  tabWidth: 2,
  printWidth: 100,
};

export default config;
```

## 5. startMongoDB.bat és prisma.ts állományok létrehozása/másolása

./data/startMongoDB.bat

```
if not exist "c:\data\" mkdir "c:\data"
if not exist "c:\data\db" mkdir "c:\data\db"
"c:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath="c:\data\db" --replSet "rs0"
```

./lib/prisma.ts

```
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
export default prisma;
```

## 6. A ".env.example" állomány átnevezése ".env"-re, majd a connection string beállítása adatbázis nevének a megadásával a MongoDB szerverhez

```
DATABASE_URL="mongodb://localhost:27017/sampleDB"
```

Mongo Atlas-t esetén:

```
DATABASE_URL="mongodb+srv://user_name:user_password@clusterName.abcdef.mongodb.net/sampleDB?retryWrites=true&w=majority&authSource=admin"
```

## 7. Local MongoDB indítása replica set-el

> data/startMongoDB.bat

## 8. Replica set inicializálása (csak egyszer kell az adatbázis tároló ("c:\data\db) létrehozásakor, megőrzésre kerül a beállítás)

### 8.1 mongo shell indítása

> mongosh

### 8.2. replica set inicializálása

> rs.initiate()

### 8.3 Az előző két pont kiváltása

> data\extract-data.bat futtatása (Csak local MongoDB Community Server 8.2-re jó!)

## 9. Prisma Schema létrehozása (minta Film modell) ./prisma/schema.prisma

```
generator client {
  provider = "prisma-client-js"
  output   = "../lib/generated/prisma"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Film {
  // id        String  @id @default(auto()) @map("_id") @db.ObjectId
  id        Int @id @map("_id")
  title     String   @unique
  content   String
  createdAt DateTime? @default(now())
  updatedAt DateTime? @updatedAt

  @@map("filmek")
}
```

majd:

> npx prisma db push<br>
> npx prisma generate<br>

## 10. A Prisma Schema-t a feltöltött (forrás) adatbázistáblákból is létrehozhatjuk

> npx prisma db pull --force<br>

majd a Prisma Schema finomítása után:

> npx prisma db push<br>
> npx prisma generate<br>

## 11. Minden schema változás után szinkronizálás az adatbázissal és a Prisma Client frissítése:

> npx prisma db push<br>
> npx prisma generate<br>

## 12. Adatok kezelése az adatbázisban: Prisma Studio

> npx prisma studio

## 13. Adatok kezelése az adatbázisban: Mongo Compass (indítás a startmenüből)

## 14. Végpontok tesztelése: Postman vagy VS Code: REST Client Extension

## 15. Linkek, dokumentációk

- [Next.js](https://nextjs.org/docs)
- [Typescript](https://www.typescriptlang.org/)
- [DevDocs](https://devdocs.io/)
- [Prisma ORM](https://www.prisma.io/docs/orm)
- [MongoDB Community Edition](https://www.mongodb.com/products/self-managed/community-edition)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
