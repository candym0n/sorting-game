const Database = require("../db.js");

class User {
    static async getUserByName(name) {
        const result = await Database.Query("SELECT * FROM `users` WHERE `name` = ?", [name]);
        return result[0];
    }
    
    static async deleteUser(id) {
        await Database.Query("DELETE FROM `users` WHERE `id` = ?", [id]);
        return id;
    }
    
    static async getUserById(id) {
        const result = await Database.Query("SELECT * FROM `users` WHERE `id` = ?", [id]);
        return result[0];
    }
    
    static async changeUserSave(id, newSave) {
        const result = await Database.Query("UPDATE `users` SET `data` = ? WHERE `id` = ?", [JSON.stringify(newSave), id]);
        return result[0];
    }
    
    static async createUser(name, hashedPassword) {
        const result = await Database.Query("INSERT INTO `users` (`name`, `password`) VALUES (?,?); SELECT `id` FROM `users` WHERE `name` = ?", [name, hashedPassword, name]);
        return result[1][0].id;
    }
}
module.exports = User;
