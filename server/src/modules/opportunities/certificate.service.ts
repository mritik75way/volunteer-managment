import PDFDocument from 'pdfkit';
import AppError from "../../common/utils/AppError";
import { Enrollment, IEnrollment } from "./models/enrollment.model";
import { Opportunity, IShift } from "./models/opportunity.model";
import { Types } from "mongoose";


interface PopulatedVolunteer {
  name: string;
}

interface PopulatedOpportunity {
  title: string;
  location: string;
  shifts: Types.DocumentArray<IShift>;
}

export const generateCertificateStream = async (enrollmentId: string) => {
    const enrollment = await Enrollment.findById(enrollmentId)
        .populate('volunteerId', 'name')
        .populate('opportunityId', 'title location');

    if (!enrollment || enrollment.status !== 'completed') {
        throw new AppError('Certificate only available for completed events', 400);
    }

    const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
    const volunteerName = (enrollment.volunteerId as unknown as PopulatedVolunteer).name;
    const eventTitle = (enrollment.opportunityId as unknown as PopulatedOpportunity).title;

    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

    doc.fontSize(40).text('CERTIFICATE OF APPRECIATION', 0, 150, { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text('This is proudly presented to', { align: 'center' });
    doc.moveDown();
    doc.fontSize(35).font('Helvetica-Bold').text(volunteerName, { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).font('Helvetica').text(`For their outstanding contribution to the event:`, { align: 'center' });
    doc.fontSize(22).font('Helvetica-Bold').text(eventTitle, { align: 'center' });
    
    doc.moveDown(2);
    doc.fontSize(14).font('Helvetica').text(`Issued on: ${new Date().toLocaleDateString()}`, { align: 'center' });

    doc.end();
    return doc;
};