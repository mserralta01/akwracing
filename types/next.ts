declare module '@/types/next' {
  export type PageProps<T = {}> = {
    params: Promise<T>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  };
} 