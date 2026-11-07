-- Cambio: los estudiantes ingresan con su usuario de la plataforma del CFP.
-- Desde ahora SOLO la función «practicas» (con la clave secreta) guarda y lee intentos.
alter table public.intentos add column if not exists estudiante_id uuid;
alter table public.intentos add column if not exists dni text;
alter table public.intentos add column if not exists estudiante text;
alter table public.intentos alter column codigo_personal drop not null;
alter table public.intentos drop constraint if exists intentos_codigo_personal_check;
create index if not exists intentos_estudiante on public.intentos (trayecto, estudiante_id);

drop policy if exists "estudiantes agregan" on public.intentos;
drop policy if exists "docentes ven intentos" on public.intentos;
revoke all on public.intentos from anon, authenticated;

-- Los intentos de prueba anteriores (sin estudiante verificado) se borran
delete from public.intentos where estudiante_id is null;

select count(*) as intentos_que_quedan from public.intentos;
