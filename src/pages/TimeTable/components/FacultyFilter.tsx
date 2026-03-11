import type { FacultyFilterProps } from "@/types/facultyType";

const FacultyFilter = ({
  faculties,
  activeFacultyId,
  onSelectFaculty,
}: FacultyFilterProps) => {
  return (
    <div className="flex justify-center mb-8 flex-wrap gap-1">
      <button
        onClick={() => onSelectFaculty(null)}
        className={`px-6 py-2 text-sm font-semibold cursor-pointer rounded transition-colors ${
          activeFacultyId === null
            ? "bg-[#E6E6FA] text-black border border-[#6495ED]"
            : "bg-[#6495ED] text-white hover:bg-blue-600"
        }`}
      >
        Tất cả
      </button>

      {faculties.map((faculty) => (
  <button
    key={faculty.facultyID}
    onClick={() => onSelectFaculty(faculty.facultyID)}
    className={
      activeFacultyId === faculty.facultyID
        ? "bg-[#E6E6FA] text-black border pl-[10px] font-semibold pr-[10px] rounded border-[#6495ED]"
        : "bg-[#6495ED] text-white hover:bg-blue-600 font-semibold pl-[10px] pr-[10px] rounded"
    }
  >
    {faculty.facultyName}
  </button>
))}
    </div>
  );
};

export default FacultyFilter;