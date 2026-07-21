#!/usr/bin/env python3
"""
Sube los archivos del proyecto al repositorio de GitHub.

Uso:
    python deploy.py                      # mensaje de commit automático
    python deploy.py "Arreglo del nav"    # mensaje propio

Coloca este script en la misma carpeta que index.html y README.md.
La primera vez clona el repositorio; después solo actualiza y sube.

Autenticación: usa la que ya tenga configurada git en tu máquina.
Si nunca has hecho push, ejecuta antes:
    git config --global user.name "Tu nombre"
    git config --global user.email "tu@correo.com"
Y cuando git te pida contraseña, usa un Personal Access Token de GitHub
(Settings > Developer settings > Personal access tokens > Tokens classic,
con permiso "repo"). Guárdalo con: git config --global credential.helper store
"""

import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

REPO_URL = "https://github.com/HeriJosue123/Reproductor_de_Musica.git"
REPO_DIR = Path("Reproductor_de_Musica")
ARCHIVOS = ["index.html", "README.md"]

AQUI = Path(__file__).resolve().parent


def git(*args, cwd=REPO_DIR):
    """Ejecuta un comando git y devuelve su salida. Aborta si falla."""
    r = subprocess.run(
        ["git", *args], cwd=cwd, capture_output=True, text=True
    )
    if r.returncode != 0:
        print(f"\n[error] git {' '.join(args)}")
        print(r.stderr.strip() or r.stdout.strip())
        sys.exit(1)
    return r.stdout.strip()


def git_opcional(*args):
    """Como git(), pero no aborta si falla (ej. pull en un repo vacío)."""
    subprocess.run(["git", *args], cwd=REPO_DIR, capture_output=True, text=True)


def main():
    mensaje = sys.argv[1] if len(sys.argv) > 1 else (
        f"Actualización {datetime.now():%d/%m/%Y %H:%M}"
    )

    # 1. Verificar que los archivos existen antes de tocar nada
    faltantes = [a for a in ARCHIVOS if not (AQUI / a).exists()]
    if faltantes:
        print("No encuentro estos archivos en", AQUI)
        for f in faltantes:
            print("  -", f)
        sys.exit(1)

    # 2. Clonar o actualizar
    if REPO_DIR.exists():
        print("Actualizando repositorio local...")
        git_opcional("pull", "--rebase")
    else:
        print("Clonando repositorio...")
        subprocess.run(["git", "clone", REPO_URL, str(REPO_DIR)], check=True)

    # 3. Copiar archivos
    for a in ARCHIVOS:
        shutil.copy2(AQUI / a, REPO_DIR / a)
        print("  copiado:", a)

    # 4. Commit y push
    if not git("status", "--porcelain"):
        print("\nNo hay cambios que subir.")
        return

    git("add", *ARCHIVOS)
    git("commit", "-m", mensaje)
    print("\nSubiendo...")
    git("push", "-u", "origin", "HEAD")

    print(f"\nListo: {mensaje}")
    print("https://herijosue123.github.io/Reproductor_de_Musica/")


if __name__ == "__main__":
    main()
