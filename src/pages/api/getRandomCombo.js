import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const combosCount = await sql`
      SELECT COUNT(*) FROM combo
    `;

    const randomIndex = Math.floor(Math.random() * combosCount[0].count);

    // Get a random combo first
    const combo = await sql`
      SELECT * FROM combo
      ORDER BY id
      LIMIT 1
      OFFSET ${randomIndex}
    `;

    if (!combo.length) {
      return res.status(404).json({ message: "No combos found" });
    }

    const comboId = combo[0].id;

    // Get the build that references this combo
    const build = await sql`
      SELECT * FROM build
      WHERE combo_id = ${comboId}
    `;

    if (!build.length) {
      return res.status(404).json({ message: "No build found for this combo" });
    }

    const buildData = build;

    // Use the build's foreign keys to get inventory and rune_page
    const inventoryCarry = await sql`
      SELECT * FROM inventory
      WHERE id = ${buildData[0].inventory_id}
    `;

    const inventorySupport = await sql`
      SELECT * FROM inventory
      WHERE id = ${buildData[1].inventory_id}
    `;

    const runePageCarry = await sql`
      SELECT * FROM rune_page
      WHERE id = ${buildData[0].rune_page_id}
    `;

    const runePageSupport = await sql`
      SELECT * FROM rune_page
      WHERE id = ${buildData[1].rune_page_id}
    `;

    // Return all related data in a single response
    return res.status(200).json({
      combo: combo[0],
      build: buildData,
      inventoryCarry: inventoryCarry[0] || null,
      inventorySupport: inventorySupport[0] || null,
      runePageCarry: runePageCarry[0] || null,
      runePageSupport: runePageSupport[0] || null,
    });
  } catch (error) {
    console.error("Database error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch data", error: error.message });
  }
}
