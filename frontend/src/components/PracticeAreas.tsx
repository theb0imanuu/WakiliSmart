
const practiceAreas = [
  { title: "Civil Litigation", desc: "Expert representation in civil disputes.", icon: "⚖️" },
  { title: "Conveyancing", desc: "Secure property transfer and land transactions.", icon: "🏠" },
  { title: "Commercial Law", desc: "Legal solutions for businesses and corporations.", icon: "🏢" },
  { title: "Family Law", desc: "Compassionate handling of divorce and custody.", icon: "👨‍👩‍👧" },
];

const PracticeAreas = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Practice Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {practiceAreas.map((area, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="text-4xl mb-4">{area.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{area.title}</h3>
              <p className="text-gray-600">{area.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PracticeAreas;
