// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

// Students
export type Student = {
  id: string;
  firstname: string;
  lastname: string;
  dateofbirth: Date;
  address: string;
  postalcode: string;
  class_id: string;
  parent_id: string;
};

export type StudentsTable = {
  id: string;
  firstname: string;
  lastname: string;
  address: string;
  class_id: string;
  parent_id: string;
  parent_name: string;
};

export type StudentForm = {
  id: string;
  firstname: string;
  lastname: string;
  dateofbirth: Date;
  address: string;
  postalcode: string;
  class_id: string;
  parent_id: string;
};

// Parents
export type Parent = {
  id: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  country_code: string;
  phone: string;
};

export type ParentsTable = {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  country_code: string;
  username: string;
};

export type ParentForm = {
  id: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  country_code: string;
  phone: string;
}

// Teachers
export type Teacher = {
  id: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  country_code: string;
  phone: string;
};

export type TeachersTable = {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  country_code: string;
  phone: string;
};

export type TeacherForm = {
  id: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  country_code: string;
  phone: string;
}

// Classes
export type ClassesTable = {
  id: string;
  name: string;
  level: string;
  teacher_id: string;
  teacher_name: string;
};

export type ClassForm = {
  id: string;
  name: string;
  level: string;
  teacher_id: string;
};



