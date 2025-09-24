import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { loadData, saveData } from '../utils/storage';

const usePersistentState = (key, defaultValue) => {
  const [state, setState] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  // Efeito para carregar os dados do Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (key === 'projects') {
        const { data, error } = await supabase
          .from(key)
          .select('*')
          .order('id', { ascending: false });
        
        if (error) {
          console.error(`Erro ao carregar dados de ${key}:`, error);
        } else {
          const projectsWithTasks = data.map(project => ({
            ...project,
            tasks: project.tasks || [],
          }));
          setState(projectsWithTasks || defaultValue);
        }
      } else if (key === 'employees') {
        const { data, error } = await supabase
          .from(key)
          .select('*');
        
        if (error) {
          console.error(`Erro ao carregar dados de ${key}:`, error);
        } else {
          setState(data || defaultValue);
        }
      }
      else {
        const savedData = loadData(key);
        if (savedData) {
          setState(savedData);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [key]);

  // Efeito para salvar os dados no Supabase e no localStorage
  useEffect(() => {
    const saveToSupabase = async () => {
      if (loading) return;

      if (key === 'projects') {
        const { error: upsertError } = await supabase
          .from('projects')
          .upsert(state, { onConflict: 'id' });

        if (upsertError) {
          console.error('Erro ao salvar os projetos:', upsertError);
        }
      } else {
        saveData(key, state);
      }
    };
    saveToSupabase();
  }, [key, state, loading]);

  return [state, setState, loading];
};

export default usePersistentState;