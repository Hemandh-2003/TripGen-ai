import PDFDocument from "pdfkit";

const asList = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (value) {
    return [value];
  }
  return [];
};

const addSection = (doc, title) => {
  doc.moveDown();

  doc
    .fillColor("#0F172A")
    .fontSize(18)
    .font("Helvetica-Bold")
    .text(title);

  doc.moveDown(0.2);

  doc
    .strokeColor("#CBD5E1")
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(545, doc.y) 
    .stroke();

  doc.moveDown();
};

const drawCard = (doc, title, content, height = 90) => {
  const y = doc.y;

  if (y + height > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
    return drawCard(doc, title, content, height);
  }

  doc
    .roundedRect(50, y, 495, height, 8)
    .fillAndStroke("#F8FAFC", "#E2E8F0");

  doc
    .fillColor("#2563EB")
    .fontSize(13)
    .font("Helvetica-Bold")
    .text(title, 65, y + 15);

  doc
    .fillColor("#111827")
    .fontSize(11)
    .font("Helvetica")
    .text(content || "N/A", 65, y + 38, {
      width: 465,
    });

  doc.y = y + height + 15;
};

const addListCard = (doc, title, items) => {
  const list = asList(items);
  if (!list.length) return;

  drawCard(
    doc,
    title,
    list.map((item) => `• ${item}`).join("\n"),
    Math.max(85, list.length * 20 + 45)
  );
};

const addBudgetPlan = (doc, budgetPlan) => {
  if (!Array.isArray(budgetPlan) || budgetPlan.length === 0) {
    return;
  }

  addSection(doc, "Budget Plan");

  budgetPlan.forEach((item) => {
    drawCard(
      doc,
      item.category || "Category",
      `Amount: ${item.amount || "N/A"}\n\n${item.notes || ""}`,
      100
    );
  });
};

const addDayWiseItinerary = (doc, days) => {
  if (!Array.isArray(days) || !days.length) {
    return;
  }

  doc.addPage();
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .fillColor("#111827")
    .text("Day Wise Itinerary");
  doc.moveDown();

  days.forEach((day) => {
    if (doc.y > doc.page.height - 180) {
      doc.addPage();
    }

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#2563EB")
      .text(`Day ${day.day_number}`);

    if (day.title) {
      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .fillColor("#111827")
        .text(day.title);
    }

    if (day.date) {
      doc
        .fontSize(11)
        .font("Helvetica")
        .fillColor("#64748B")
        .text(day.date);
    }

    doc.moveDown(0.5);

    day.activities?.forEach((activity) => {
      const calculatedHeight = activity.description ? 110 : 75;
      
      drawCard(
        doc,
        activity.time || "Anytime",
        `${activity.activity_title || ""}\n\n${activity.description || ""}`,
        calculatedHeight
      );
    });

    doc.moveDown();
  });
};

export const generatePDF = (trip, res) => {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=tripgen-itinerary.pdf"
  );

  doc.pipe(res);

  doc
    .fontSize(34)
    .font("Helvetica-Bold")
    .fillColor("#2563EB")
    .text("TripGen AI", { align: "center" });

  doc.moveDown(0.3);

  doc
    .fontSize(14)
    .font("Helvetica")
    .fillColor("#64748B")
    .text("Smart Travel Itinerary", { align: "center" });

  doc.moveDown(1.5);

  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .fillColor("#111827")
    .text(trip.destination || "Destination", { align: "center" });

  if (trip.checkIn && trip.checkOut) {
    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#64748B")
      .text(`${trip.checkIn} → ${trip.checkOut}`, { align: "center" });
  }

  doc.moveDown(2);

  addSection(doc, "Trip Overview");
  
  if (trip.source === "ai-planner") {
    drawCard(doc, "Budget Structure", `Budget Category: ${trip.budget || "N/A"}`, 65);
    drawCard(doc, "Duration Total", `${trip.days || "0"} Days Planned`, 65);
  } else {
    const hotelDetails = `Hotel Target: ${trip.hotel || "N/A"}\nCheck In Date: ${trip.checkIn || "N/A"}\nCheck Out Date: ${trip.checkOut || "N/A"}`;
    drawCard(doc, "Hospitality Stay", hotelDetails, 95);
    drawCard(doc, "Party Demographics", `${trip.guests || "1"} Registered Guests`, 65);
  }

  addSection(doc, "Travel Summary");
  drawCard(doc, "Summary Description", trip.summary || "No summary available.", 110);

  addDayWiseItinerary(doc, trip.days);

  const recommendations = trip.recommendations || {};
  doc.addPage();

  addSection(doc, "AI Travel Recommendations");

  addListCard(doc, "Places To Visit", recommendations.placesToVisit);
  addListCard(doc, "Restaurants", recommendations.restaurants);
  addListCard(doc, "Local Attractions", recommendations.localAttractions);
  addListCard(doc, "Transportation", recommendations.transportation);
  addListCard(doc, "Travel Tips", recommendations.travelTips);

  if (recommendations.bestTimeToVisit) {
    drawCard(doc, "Best Time To Visit", recommendations.bestTimeToVisit, 70);
  }

  if (recommendations.estimatedBudget) {
    drawCard(doc, "Estimated Budget Breakdown", recommendations.estimatedBudget, 70);
  }

  addBudgetPlan(doc, recommendations.budgetPlan);

  doc.moveDown(2);
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#94A3B8")
    .text(
      `Generated by TripGen AI • ${new Date().toLocaleDateString()}`,
      { align: "center" }
    );

  doc.end();
};