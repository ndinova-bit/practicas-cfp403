-- Esquema propuesto para el proyecto Supabase de la plataforma de prácticas.
-- NO ejecutar todavía: se revisa y se aplica cuando el proyecto esté creado.
create table if not exists public.intentos (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  trayecto text not null check (trayecto ~ '^[a-z-]{2,30}$'),
  practica int not null check (practica between 1 and 100),
  codigo_personal text not null check (codigo_personal ~ '^[A-ZÁÉÍÓÚÑÜ]{2,40}[0-9]{4}$'),
  puntaje int not null check (puntaje between 0 and 100),
  codigo text not null check (length(codigo) <= 20),
  detalle jsonb
);
alter table public.intentos enable row level security;
-- Cualquiera (estudiantes sin cuenta) puede AGREGAR un intento, pero no verlos, cambiarlos ni borrarlos.
create policy "agregar intentos" on public.intentos for insert to anon with check (true);
-- Solo docentes con usuario (autenticados) pueden verlos.
create policy "docentes ven intentos" on public.intentos for select to authenticated using (true);
