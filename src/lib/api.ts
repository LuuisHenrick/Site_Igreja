import { supabase } from './supabase';
import type { Member, Asset, MediaFile, FinancialRecord, Event, EducationEvent } from './store';

const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  throw new Error(error.message || 'An error occurred while accessing the database');
};

export const membersApi = {
  async getAll(): Promise<Member[]> {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) handleSupabaseError(error);
    return data?.map(member => ({
      ...member,
      id: member.id,
      createdAt: member.created_at,
      birthDate: member.birth_date,
      conversionDate: member.conversion_date,
      baptismDate: member.baptism_date,
      isBaptized: member.is_baptized,
      maritalStatus: member.marital_status,
    })) || [];
  },

  async create(member: Omit<Member, 'id' | 'createdAt'>): Promise<Member> {
    const { data, error } = await supabase
      .from('members')
      .insert([{
        name: member.name,
        email: member.email,
        phone: member.phone,
        photo: member.photo,
        address: member.address,
        birth_date: member.birthDate,
        role: member.role,
        status: member.status,
        permissions: member.permissions,
        conversion_date: member.conversionDate,
        baptism_date: member.baptismDate,
        is_baptized: member.isBaptized,
        category: member.category,
        position: member.position,
        marital_status: member.maritalStatus,
      }])
      .select()
      .single();

    if (error) handleSupabaseError(error);
    if (!data) throw new Error('Failed to create member');

    return {
      ...data,
      id: data.id,
      createdAt: data.created_at,
      birthDate: data.birth_date,
      conversionDate: data.conversion_date,
      baptismDate: data.baptism_date,
      isBaptized: data.is_baptized,
      maritalStatus: data.marital_status,
    };
  },

  async update(id: string, member: Partial<Member>): Promise<Member> {
    const { data, error } = await supabase
      .from('members')
      .update({
        ...member,
        birth_date: member.birthDate,
        conversion_date: member.conversionDate,
        baptism_date: member.baptismDate,
        is_baptized: member.isBaptized,
        marital_status: member.maritalStatus,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    if (!data) throw new Error('Member not found');

    return {
      ...data,
      id: data.id,
      createdAt: data.created_at,
      birthDate: data.birth_date,
      conversionDate: data.conversion_date,
      baptismDate: data.baptism_date,
      isBaptized: data.is_baptized,
      maritalStatus: data.marital_status,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);

    if (error) handleSupabaseError(error);
  },
};

export const assetsApi = {
  async getAll(): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) handleSupabaseError(error);
    return data?.map(asset => ({
      ...asset,
      id: asset.id,
      createdAt: asset.created_at,
      acquisitionDate: asset.acquisition_date,
      lastModifiedAt: asset.last_modified_at,
      lastModifiedBy: asset.last_modified_by,
    })) || [];
  },

  async create(asset: Omit<Asset, 'id' | 'createdAt'>): Promise<Asset> {
    const { data, error } = await supabase
      .from('assets')
      .insert([{
        name: asset.name,
        description: asset.description,
        category: asset.category,
        location: asset.location,
        status: asset.status,
        acquisition_date: asset.acquisitionDate,
        value: asset.value,
        documents: asset.documents,
      }])
      .select()
      .single();

    if (error) handleSupabaseError(error);
    if (!data) throw new Error('Failed to create asset');

    return {
      ...data,
      id: data.id,
      createdAt: data.created_at,
      acquisitionDate: data.acquisition_date,
      lastModifiedAt: data.last_modified_at,
      lastModifiedBy: data.last_modified_by,
    };
  },

  async update(id: string, asset: Partial<Asset>): Promise<Asset> {
    const { data, error } = await supabase
      .from('assets')
      .update({
        ...asset,
        acquisition_date: asset.acquisitionDate,
        last_modified_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    if (!data) throw new Error('Asset not found');

    return {
      ...data,
      id: data.id,
      createdAt: data.created_at,
      acquisitionDate: data.acquisition_date,
      lastModifiedAt: data.last_modified_at,
      lastModifiedBy: data.last_modified_by,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);

    if (error) handleSupabaseError(error);
  },
};

export const mediaApi = {
  async getAll(): Promise<MediaFile[]> {
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) handleSupabaseError(error);
    return data?.map(file => ({
      ...file,
      id: file.id,
      uploadDate: file.upload_date,
    })) || [];
  },

  async create(file: Omit<MediaFile, 'id' | 'uploadDate'>): Promise<MediaFile> {
    const { data, error } = await supabase
      .from('media_files')
      .insert([{
        title: file.title,
        type: file.type,
        url: file.url,
        thumbnail: file.thumbnail,
        size: file.size,
        category: file.category,
      }])
      .select()
      .single();

    if (error) handleSupabaseError(error);
    if (!data) throw new Error('Failed to create media file');

    return {
      ...data,
      id: data.id,
      uploadDate: data.upload_date,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('media_files')
      .delete()
      .eq('id', id);

    if (error) handleSupabaseError(error);
  },
};

export const financialApi = {
  async getAll(): Promise<FinancialRecord[]> {
    const { data, error } = await supabase
      .from('financial_records')
      .select('*')
      .order('date', { ascending: false });

    if (error) handleSupabaseError(error);
    return data || [];
  },

  async create(record: Omit<FinancialRecord, 'id'>): Promise<FinancialRecord> {
    const { data, error } = await supabase
      .from('financial_records')
      .insert([record])
      .select()
      .single();

    if (error) handleSupabaseError(error);
    if (!data) throw new Error('Failed to create financial record');

    return data;
  },

  async update(id: string, record: Partial<FinancialRecord>): Promise<FinancialRecord> {
    const { data, error } = await supabase
      .from('financial_records')
      .update(record)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    if (!data) throw new Error('Financial record not found');

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('financial_records')
      .delete()
      .eq('id', id);

    if (error) handleSupabaseError(error);
  },
};

export const eventsApi = {
  async getAll(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) handleSupabaseError(error);
    return data || [];
  },

  async create(event: Omit<Event, 'id'>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();

    if (error) handleSupabaseError(error);
    if (!data) throw new Error('Failed to create event');

    return data;
  },

  async update(id: string, event: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', id)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    if (!data) throw new Error('Event not found');

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) handleSupabaseError(error);
  },
};

export const educationApi = {
  async getAll(): Promise<EducationEvent[]> {
    const { data, error } = await supabase
      .from('education_events')
      .select('*')
      .order('date', { ascending: true });

    if (error) handleSupabaseError(error);
    return data || [];
  },

  async create(event: Omit<EducationEvent, 'id'>): Promise<EducationEvent> {
    const { data, error } = await supabase
      .from('education_events')
      .insert([event])
      .select()
      .single();

    if (error) handleSupabaseError(error);
    if (!data) throw new Error('Failed to create education event');

    return data;
  },

  async update(id: string, event: Partial<EducationEvent>): Promise<EducationEvent> {
    const { data, error } = await supabase
      .from('education_events')
      .update(event)
      .eq('id', id)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    if (!data) throw new Error('Education event not found');

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('education_events')
      .delete()
      .eq('id', id);

    if (error) handleSupabaseError(error);
  },
};