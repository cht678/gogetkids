'use client'

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import React, { useRef } from 'react';
import { parseSchedulesJSON, parseSchedulesCSVToJSON, insertSchedulesFromJSON } from '@/app/lib/bulkUpload'; // Import parseSchedulesCSVToJSON function
import toast from 'react-hot-toast';
import { revalidatePath } from 'next/cache';

const BulkImportForm = () => {
  const jsonFileInputRef = useRef<HTMLInputElement | null>(null);
  const csvFileInputRef = useRef<HTMLInputElement | null>(null); // Add CSV file input reference

  const handleJSONFileUpload = async () => {
    if (jsonFileInputRef.current && jsonFileInputRef.current.files) {
      const file = jsonFileInputRef.current.files[0];

      console.log('File selected:', file);
      console.log('File type:', file.type);

      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target && event.target.result) {
          const jsonData = event.target.result as string;

          try {
            // Parse the JSON data
            const parsedSchedules = await parseSchedulesJSON(jsonData);
            console.log('Parsed schedules:', parsedSchedules);

            // Insert schedules into the database
            await insertSchedulesFromJSON(parsedSchedules);
            console.log('Schedules inserted successfully');
            toast.success('Schedules inserted successfully!');
            revalidatePath('/dashboard/schedules');
          } catch (error) {
            console.error('Error importing schedules:', error);
            toast.error('Failed to import schedules. Please try again.');
          }
        }
      };
      reader.readAsText(file);
    } else {
      console.error('No JSON file selected or file input not found.');
    }
  };

  const handleCSVFileUpload = async () => {
    if (csvFileInputRef.current && csvFileInputRef.current.files) {
      const file = csvFileInputRef.current.files[0];

      console.log('File selected:', file);
      console.log('File type:', file.type);

      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target && event.target.result) {
          const csvData = event.target.result as string;

          try {
            // Parse the CSV data to JSON
            const parsedSchedules = await parseSchedulesCSVToJSON(csvData);
            console.log('Parsed schedules from CSV:', parsedSchedules);

            // Insert schedules into the database
            await insertSchedulesFromJSON(parsedSchedules);
            console.log('Schedules inserted successfully');
            toast.success('Schedules inserted successfully!');
            revalidatePath('/dashboard/schedules');
          } catch (error) {
            console.error('Error importing schedules from CSV:', error);
            toast.error('Failed to import schedules from CSV. Please try again.');
          }
        }
      };
      reader.readAsText(file);
    } else {
      console.error('No CSV file selected or file input not found.');
    }
  };

  return (
    <form>
      <div className="rounded-md bg-gray-50 p-6 md:p-8 space-y-6">
        {/* JSON File Input */}
        <div>
          <label htmlFor="jsonFile" className="block text-sm font-medium">
            Upload JSON File
          </label>
          <div className="mt-2">
            <input
              ref={jsonFileInputRef}
              id="jsonFile"
              name="jsonFile"
              type="file"
              accept=".json"
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">Please ensure that the uploaded JSON file follows the specified format:</p>
          <pre className="mt-2 bg-gray-100 p-2 rounded-md overflow-auto">{`{
  "studentid": 190694,
  "date": "2024-03-25",
  "transport_type": "Bus",
  "pickup_time": "07:00",
  "dismissal_time": "14:00",
  "school_name": "Test School 1"
}`}</pre>
          {/* Bulk Create JSON Button */}
          <Button type="button" onClick={handleJSONFileUpload} className="mt-4">
            Bulk Create JSON
          </Button>
        </div>

        {/* CSV File Input */}
        <div>
          <label htmlFor="csvFile" className="block text-sm font-medium">
            Upload CSV File
          </label>
          <div className="mt-2">
            <input
              ref={csvFileInputRef}
              id="csvFile"
              name="csvFile"
              type="file"
              accept=".csv"
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">Please ensure that the uploaded CSV file follows the specified format:</p>
          <pre className="mt-2 bg-gray-100 p-2 rounded-md overflow-auto">{`studentid,date,transport_type,pickup_time,dismissal_time,school_name
190694,2024-03-25,Bus,07:00,14:00,Test School 1`}</pre>
          {/* Bulk Create CSV Button */}
          <Button type="button" onClick={handleCSVFileUpload} className="mt-4">
            Bulk Create CSV
          </Button>
        </div>
      </div>

      {/* Return Button */}
      <div className="mt-6 flex justify-end">
        <Link
          href="/dashboard/schedules"
          className="h-10 flex items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Return
        </Link>
      </div>
    </form>
  );
};

export default BulkImportForm;
