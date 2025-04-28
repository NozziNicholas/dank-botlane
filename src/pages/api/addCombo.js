import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      combo,
      build,
      inventoryCarry,
      inventorySupport,
      runePageCarry,
      runePageSupport,
    } = req.body;

    // Validate required data
    if (
      !combo ||
      !build ||
      !inventoryCarry ||
      !inventorySupport ||
      !runePageCarry ||
      !runePageSupport
    ) {
      return res.status(400).json({ message: "Missing required data" });
    }

    const sql = neon(process.env.DATABASE_URL);

    // Start a transaction
    await sql`BEGIN`;

    try {
      // Insert the combo
      const comboResult = await sql`
        INSERT INTO combo (carry_id, support_id)
        VALUES (${combo.carry_id}, ${combo.support_id})
        RETURNING id
      `;
      const comboId = comboResult[0].id;

      // Insert rune pages
      const runePageCarryResult = await sql`
        INSERT INTO rune_page (
          primary_rune,
          secondary_rune
        )
        VALUES (
          ${JSON.stringify(runePageCarry.primary_rune)},
          ${JSON.stringify(runePageCarry.secondary_rune)}
        )
        RETURNING id
      `;
      const runePageCarryId = runePageCarryResult[0].id;

      const runePageSupportResult = await sql`
        INSERT INTO rune_page (
          primary_rune,
          secondary_rune
        )
        VALUES (
          ${JSON.stringify(runePageSupport.primary_rune)},
          ${JSON.stringify(runePageSupport.secondary_rune)}
        )
        RETURNING id
      `;
      const runePageSupportId = runePageSupportResult[0].id;

      // Insert inventories
      const inventoryCarryResult = await sql`
        INSERT INTO inventory (
          items
        )
        VALUES (
          ${JSON.stringify(inventoryCarry.items)}
        )
        RETURNING id
      `;
      const inventoryCarryId = inventoryCarryResult[0].id;

      const inventorySupportResult = await sql`
        INSERT INTO inventory (
          items
        )
        VALUES (
          ${JSON.stringify(inventorySupport.items)}
        )
        RETURNING id
      `;
      const inventorySupportId = inventorySupportResult[0].id;

      // Insert builds
      await sql`
        INSERT INTO build (
          combo_id,
          champion_id,
          rune_page_id,
          inventory_id,
          summoner_d,
          summoner_f,
          skill_order
        )
        VALUES 
        (${comboId}, ${build[0].champion_id}, ${runePageCarryId}, ${inventoryCarryId}, 
         ${build[0].summoner_d}, ${build[0].summoner_f}, ${build[0].skill_order}),
        (${comboId}, ${build[1].champion_id}, ${runePageSupportId}, ${inventorySupportId}, 
         ${build[1].summoner_d}, ${build[1].summoner_f}, ${build[1].skill_order})
      `;

      // Commit the transaction
      await sql`COMMIT`;

      return res.status(200).json({
        message: "Combo added successfully",
        comboId,
      });
    } catch (error) {
      // Rollback the transaction in case of error
      await sql`ROLLBACK`;
      throw error;
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      message: "Failed to add combo",
      error: error.message,
    });
  }
}
