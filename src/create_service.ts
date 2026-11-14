import { fileType, targetPath, genOpts } from './context.js';
import { convertCase, writeFiles } from '../utils/utils.js';


export function createService(name: string): void {
   writeFiles([
      [`${targetPath}/services/${name}.${fileType}`, `export async function ${name}(data) {
   try {
      const response = await fetch('<API_URL>', {
         method: 'POST',
         headers: {
         'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
      });
   
      if (!response.ok) throw new Error('Failed to create item');
      return await response.json();
   } catch (error) {
      console.error('Error creating item:', error);
      throw error;
   }
}`],
   ], genOpts);
};

export function getService(name: string): void {
   writeFiles([
      [`${targetPath}/services/${name}.${fileType}`, `export async function ${name}(id) {
   try {
      const response = await fetch('<API_URL>/'+id);
      if (!response.ok) throw new Error('Item not found');
      return await response.json();
   } catch (error) {
      console.error('Error fetching item: '+id, error);
      throw error;
   }
}`],
   ], genOpts);
};

export function updateService(name: string): void {
   writeFiles([
      [`${targetPath}/services/${name}.${fileType}`, `export async function ${name}(id, data) {
   try {
      const response = await fetch('<API_URL>/'+id, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update item');
      return await response.json();
   } catch (error) {
      console.error('Error updating item: '+id, error);
      throw error;
   }
}`],
   ], genOpts);
};

export function deleteService(name: string): void {
   writeFiles([
      [`${targetPath}/services/${name}.${fileType}`, `export async function ${name}(id) {
   try {
      const response = await fetch('<API_URL>/'+id, {
         method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete item');
      return await response.json();
   } catch (error) {
      console.error('Error deleting item: '+id, error);
      throw error;
   }
}`],
   ], genOpts);
};

export function createCRUD(name: string): void {
   name = convertCase(name, 'pascal');
   writeFiles([
      [`${targetPath}/services/crud${name}.${fileType}`, `export async function create${name}(data) {
      try {
         const response = await fetch('<API_URL>', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
         });
      
         if (!response.ok) throw new Error('Failed to create item');
         return await response.json();
      } catch (error) {
         console.error('Error creating item:', error);
         throw error;
      }
   }

   export async function getAll${name}() {
      try {
         const response = await fetch('<API_URL>');
         if (!response.ok) throw new Error('Failed to fetch items');
         return await response.json();
      } catch (error) {
         console.error('Error fetching items:', error);
         throw error;
      }
   }

   export async function get${name}(id) {
      try {
         const response = await fetch('<API_URL>/'+id);
         if (!response.ok) throw new Error('Item not found');
         return await response.json();
      } catch (error) {
         console.error('Error fetching item: '+id, error);
         throw error;
      }
   }
   
   export async function update${name}(id, data) {
      try {
         const response = await fetch('<API_URL>/'+id, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
         });
         if (!response.ok) throw new Error('Failed to update item');
         return await response.json();
      } catch (error) {
         console.error('Error updating item: '+id, error);
         throw error;
      }
   }
   
   export async function delete${name}(id) {
      try {
         const response = await fetch('<API_URL>/'+id, {
            method: 'DELETE',
         });
         if (!response.ok) throw new Error('Failed to delete item');
         return await response.json();
      } catch (error) {
         console.error('Error deleting item: '+id, error);
         throw error;
      }
   }`],
   ], genOpts);
};
