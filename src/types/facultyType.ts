export interface Faculty {
    facultyID: string;
    facultyName: string;
    createdAt: string;
    updatedAt: string;
}
export interface FacultyFilterProps {
  faculties: Faculty[];
  activeFacultyId: string | null;
  onSelectFaculty: (facultyId: string | null) => void;
};