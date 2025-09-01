export interface SubDrug {
  name: string;
  'kelas terapi'?: string;
  'sub kelas terapi'?: string;
  'sub sub kelas terapi'?: string;
  'kategori antibiotik'?: string;
  'nama obat'?: string;
  sediaan?: string;
  kekuatan?: string;
  satuan?: string;
  fpktp?: boolean;
  fpktl?: boolean;
  pp?: boolean;
  prb?: boolean;
  oen?: boolean;
  kanker?: boolean;
  komposisi?: string;
  program?: string;
  'peresepan maksimal'?: string;
  'restriksi obat'?: string;
  'ketentuan tambahan'?: string;
  'berkas lampiran'?: string;
  'restriksi kelas terapi'?: string;
  'restriksi sub sub kelas terapi'?: string;
  'restriksi sediaan'?: string;
  'restriksi sub kelas terapi'?: string;
  alias?: string;
  [key: string]: any; // For any additional fields
}

export interface Drug {
  name: string;
  subdrugs: SubDrug[];
}

export interface AppState {
  data: Drug[];
  letter: string | null;
  drug: Drug | null;
  subdrug: SubDrug | null;
  query: string;
}
