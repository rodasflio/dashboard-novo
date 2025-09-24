import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { loadData, saveData } from '../utils/storage';

const usePersistentState = (key, defaultValue, session, extraDependency) => {
  const isSupabaseKey = key === 'projects' || key === 'employees' || key === 'profiles';

  const [state, setState] = useState(() => {
    if (!isSupabaseKey && typeof window !== 'undefined') {
      const savedData = loadData(key);
      if (savedData !== undefined) {
        return savedData;
      }
    }
    return defaultValue;
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!isSupabaseKey || !session || !session.user) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from(key)
        .select('*')
        // AQUI ESTÁ A CORREÇÃO: Usamos .eq('id', ...) para perfis
        .eq(key === 'profiles' ? 'id' : 'user_id', session.user.id);
      
      if (error) {
        console.error(`Erro ao carregar dados de ${key}:`, error);
      } else {
        const projectsWithTasks = data.map(project => ({
          ...project,
          tasks: project.tasks || [],
        }));
        setState(projectsWithTasks || defaultValue);
      }
      setLoading(false);
    };
    
    fetchData();
  }, [key, session, isSupabaseKey, extraDependency]);

  useEffect(() => {
    if (!isSupabaseKey) {
      saveData(key, state);
    }
  }, [key, state, isSupabaseKey]);

  return [state, setState, loading];
};

export default usePersistentState;