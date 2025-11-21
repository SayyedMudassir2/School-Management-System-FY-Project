
'use client';

import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { StudentProfile } from "@/lib/mock-data";
import { format } from "date-fns";
import Image from "next/image";

type IdCardTemplateProps = {
  student: StudentProfile;
};

// A simple QR Code component placeholder
const QrCodePlaceholder = () => (
    <div className="w-20 h-20 bg-gray-200 flex items-center justify-center">
        <Image src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=Example" alt="QR Code" width={80} height={80} />
    </div>
);


export function IdCardTemplate({ student }: IdCardTemplateProps) {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  return (
    <div className="p-4 bg-gray-50 text-black font-sans text-sm">
        <h3 className="text-lg font-bold mb-4 text-center">ID Card Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Front of ID Card */}
            <div className="w-[320px] h-[200px] bg-white rounded-xl shadow-lg border p-4 flex flex-col justify-between mx-auto">
                <div className="flex items-center justify-between">
                    <Logo />
                    <p className="text-xs font-bold text-blue-800">STUDENT</p>
                </div>
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-primary">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold text-lg leading-tight">{student.name}</p>
                        <p className="text-gray-600">Class: {student.class}-{student.section}</p>
                        <p className="text-gray-600">ID: {student.admissionNo}</p>
                    </div>
                </div>
                 <div className="text-right text-xs text-gray-500">
                    Expires: {format(expiryDate, 'MM/yyyy')}
                </div>
            </div>

            {/* Back of ID Card */}
            <div className="w-[320px] h-[200px] bg-white rounded-xl shadow-lg border p-4 flex flex-col justify-between mx-auto">
                <div className="text-xs">
                    <p><span className="font-semibold">Parent:</span> {student.parentName}</p>
                    <p><span className="font-semibold">Contact:</span> {student.parentContact}</p>
                    <p className="mt-2"><span className="font-semibold">Address:</span> {student.address}</p>
                </div>
                <div className="flex items-end justify-between">
                    <div className="text-[8px] text-gray-500 leading-tight max-w-[180px]">
                        <p>If found, please return to:</p>
                        <p className="font-semibold">Aedura Elite School, 123 Education Lane, Knowledge City</p>
                    </div>
                    <QrCodePlaceholder />
                </div>
            </div>
        </div>
    </div>
  );
}
