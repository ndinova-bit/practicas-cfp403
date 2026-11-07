-- Función mínima para que el aviso automático de GitHub mantenga activo el proyecto.
-- No lee ni escribe ningún dato: solo responde 1.
create or replace function public.ping() returns int
language sql stable as $$ select 1 $$;
grant execute on function public.ping() to anon;
