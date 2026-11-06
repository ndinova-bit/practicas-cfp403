-- Plataforma de prácticas · CFP N.º 403
-- Pegar completo en el SQL Editor del proyecto NUEVO de Supabase y tocar «Run».

-- 1. Intentos de práctica
create table if not exists public.intentos (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  trayecto text not null check (trayecto ~ '^[a-z-]{2,30}$'),
  practica int not null check (practica between 1 and 100),
  codigo_personal text not null check (codigo_personal ~ '^[A-ZÁÉÍÓÚÑÜ]{2,40}[0-9]{4}$'),
  puntaje int not null check (puntaje between 0 and 100),
  codigo text not null check (length(codigo) <= 20),
  detalle jsonb check (pg_column_size(detalle) < 8000)
);
create index if not exists intentos_busqueda on public.intentos (trayecto, practica, codigo_personal);

-- 2. Docentes habilitados para ver los intentos (se cargan por correo)
create table if not exists public.docentes (
  correo text primary key,
  nombre text,
  creado timestamptz not null default now()
);

alter table public.intentos enable row level security;
alter table public.docentes enable row level security;

-- Estudiantes (sin cuenta): solo pueden AGREGAR intentos. No ven, no cambian, no borran.
drop policy if exists "estudiantes agregan" on public.intentos;
create policy "estudiantes agregan" on public.intentos for insert to anon, authenticated with check (true);

-- Docentes: ven los intentos solo si su correo está en la tabla docentes.
drop policy if exists "docentes ven intentos" on public.intentos;
create policy "docentes ven intentos" on public.intentos for select to authenticated
  using (exists (select 1 from public.docentes d where d.correo = lower(auth.jwt() ->> 'email')));

drop policy if exists "docentes se ven" on public.docentes;
create policy "docentes se ven" on public.docentes for select to authenticated
  using (correo = lower(auth.jwt() ->> 'email'));

revoke update, delete on public.intentos from anon, authenticated;
revoke insert, update, delete on public.docentes from anon, authenticated;
grant insert on public.intentos to anon, authenticated;
grant select on public.intentos to authenticated;
grant select on public.docentes to authenticated;

-- 3. Docentes habilitados (agregar más con otra línea igual)
insert into public.docentes (correo, nombre) values ('ndinova@abc.gob.ar', 'Nicolás Dinova')
  on conflict (correo) do nothing;
