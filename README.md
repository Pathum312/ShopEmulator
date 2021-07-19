# ShopEmulator

### APIs ###

### /api/customers ###

1. `GET``/createItemTable`: Creates the Item table in the Shop database.
2. `/createShopOwnerTable`: Created the shop_owner table in the Shop database.
3. `/addOwner`: Adds a owners data to the Shop_Owner table.
4. `/addItem`: Adds an item to the Item table, also checks if this item is already added to the Item table.
5. `/getItems`: Gets a the items in an array from teh Item table.
6. `/buyItem`: Is able to buy an item and a certain quantity like "2 Bottles", when purchased the Bottle recored in the Item table is updated with the new stock value and the owner's record in the Shop_Owner table is also updated for the profits he made from that purchase.

  
