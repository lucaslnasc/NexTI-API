#!/bin/sh
set -e

echo "[BUILD] Iniciando build Prisma com pooler..."
prisma generate
if prisma db push --accept-data-loss; then
  echo "[BUILD] db push executado com sucesso."
else
  echo "[BUILD] db push falhou, tentando migrate deploy..."
  prisma migrate deploy
fi

echo "[BUILD] Compilando TypeScript..."
tsccode=$((tsc && tsc-alias) || echo "[BUILD] Falha na compilação TypeScript!")

echo "[BUILD] Build finalizado."
