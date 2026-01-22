import Link from 'next/link';

export default function Compliance() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Compliance Guide for Hazardous Transport</h1>
          <p className="text-xl text-gray-600">Ensure your mining transport operations meet South African regulatory standards.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-700 mb-4">
            To ensure compliance with South African regulations on hazardous material transport (especially for mining logistics like cathodes, explosives, or chemicals), transporters must adhere to a comprehensive framework overseen by the Department of Transport (DoT), with additional oversight from the Department of Mineral Resources and Energy (DMRE) for mining-specific hazards.
          </p>
          <p className="text-gray-700">
            This guide summarizes key requirements. For official details, visit <a href="https://www.transport.gov.za" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">transport.gov.za</a> or <a href="https://www.energy.gov.za" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">energy.gov.za</a>.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Key Regulations</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>National Road Traffic Act 93 of 1996 and Regulation 280 (2000)</strong>: Core rules for dangerous goods transport by road, classifying materials and requiring UN-compliant handling.</li>
              <li><strong>Hazardous Substances Act 15 of 1973</strong>: Permits for Group 1-5 substances (e.g., cyanide, acids).</li>
              <li><strong>Mine Health and Safety Act 29 of 1996</strong>: Mining-specific rules for explosives, fuels, and chemical transport.</li>
              <li><strong>Explosives Act 26 of 1956</strong>: Strict controls on explosives transport.</li>
              <li><strong>National Environmental Management Act 107 of 1998</strong>: Environmental safeguards against spills.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Requirements for Transporters</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Licensing and Permits</strong>: Obtain dangerous goods carrier permit from DoT; DMRE permits for mining hazards.</li>
              <li><strong>Safety Management Systems</strong>: Documented SMS with risk assessments and incident reporting.</li>
              <li><strong>Training and Personnel</strong>: ADR-equivalent training for staff; specialized for mining.</li>
              <li><strong>Insurance</strong>: Adequate coverage for environmental damage and liability.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Requirements for Vehicles</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Design and Equipment</strong>: ADR-compliant with placards, emergency kits, and reinforced for bulk loads.</li>
              <li><strong>Maintenance</strong>: Annual inspections; special features for mining (e.g., dust suppression).</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Requirements for Drivers</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Licensing and Training</strong>: Valid driver's license and ADR training.</li>
              <li><strong>Medical Fitness</strong>: Annual checks and drug testing.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Documentation Requirements</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Transport Documents</strong>: Dangerous Goods Declaration with UN numbers and SDS.</li>
              <li><strong>Emergency Plans</strong>: Written response plans and records.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Ensuring Compliance</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Audits and Inspections</strong>: Self-audits and prepare for DoT checks.</li>
              <li><strong>Penalties</strong>: Fines up to R1 million or license suspension for violations.</li>
              <li><strong>Updates (2026)</strong>: Potential stricter emissions rules and digital systems.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}