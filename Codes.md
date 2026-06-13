## 今後提示する予定だったコードを順番に載せる。この順番で説明を行っていく。

# ステップ2-2
## CakeShop.java
```
@RequestMapping("/order")
    String order(@RequestParam("id") List<Integer> ids,@RequestParam("count") List<Integer> counts) {
        for(int i = 0; i<counts.size(); i++){
            if(counts.get(i) > 0){
                //DAO のorderメソッドを呼び出す。
            }
        }
        return "redirect:/";
    }
```

# ステップ2-3
### DAOに調整を加えていく。
## CakeDao.java
```
package com.example.demo;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class CakeDao {
    private final JdbcTemplate jdbcTemplate;

    CakeDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    String select2(int id) {
        String sql = "SELECT price FROM cake WHERE id=?"; // ? はプレースホルダ
        String price = jdbcTemplate.queryForObject(sql, String.class, id); // ここで ? を引数 id の値に置き換える
        return price;
    }

    /* 今回は省略のため、各自が実装している他の必要のないselectメソッドはこのコメントアウト部分に記述されていることにする。*/

    public List<Map<String, Object>> select10b() {  // 3.2節で説明されたメソッド
        String sql = """
                SELECT
                    o_time.id,
                    o_time.time,
                    cake.name,
                    cake.price,
                    o_qtt.quantity
                FROM o_time       -- テーブル1
                    INNER JOIN o_qtt  -- テーブル2
                    ON o_time.id = o_qtt.time_id
                    INNER JOIN cake   -- テーブル3
                    ON o_qtt.cake_id = cake.id;
                    """;
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
        return result;
    }

    public List<Map<String,Object>> select7() { // 3.2節で説明したメソッド
        String sql = "SELECT * FROM cake";
        List<Map<String,Object>> result = jdbcTemplate.queryForList(sql); // マップを要素とするリスト
        return result;
    }
}
```

### 新しいメソッドを作る1
## 3.3節で紹介されているコード
```
int newcake(String name, int price) {
    String sql = "INSERT INTO cake(name, price) VALUES(?, ?)";
    int count = jdbcTemplate.update(sql, name, price);
    return count;
}
```
## CakeDao.java
```
package com.example.demo;

import java.util.List;
import java.util.Map;
import java.time.LocalTime;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Repository;

@Repository
public class CakeDao {
    private final JdbcTemplate jdbcTemplate;

    CakeDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    String select2(int id) {
        String sql = "SELECT price FROM cake WHERE id = ?";
        String price = jdbcTemplate.queryForObject(sql, String.class, id);
        return price;
    }

    public List<Map<String, Object>> select10b() {
        String sql = """
                SELECT
                    o_time.id,
                    o_time.time,
                    cake.name,
                    cake.price,
                    o_qtt.quantity
                FROM o_time       -- テーブル1
                    INNER JOIN o_qtt  -- テーブル2
                    ON o_time.id = o_qtt.time_id
                    INNER JOIN cake   -- テーブル3
                    ON o_qtt.cake_id = cake.id;
                    """;
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
        return result;
    }

    List<Map<String, Object>> select7() {
        String sql = "SELECT * FROM cake";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
        return result;
    }

    String orderT(String time_id){
        String sql_time = "INSERT INTO o_time(id) VALUES(?)";
        int count_time = jdbcTemplate.update(sql_time, time_id);
        return ("" + count_time);
    }
}
```

### 新しいメソッドを作る2
## CakeDao.java
```
package com.example.demo;

import java.util.List;
import java.util.Map;
import java.time.LocalTime;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Repository;

@Repository
public class CakeDao {
    private final JdbcTemplate jdbcTemplate;

    CakeDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    String select2(int id) {
        String sql = "SELECT price FROM cake WHERE id = ?";
        String price = jdbcTemplate.queryForObject(sql, String.class, id);
        return price;
    }

    public List<Map<String, Object>> select10b() {
        String sql = """
                SELECT
                    o_time.id,
                    o_time.time,
                    cake.name,
                    cake.price,
                    o_qtt.quantity
                FROM o_time       -- テーブル1
                    INNER JOIN o_qtt  -- テーブル2
                    ON o_time.id = o_qtt.time_id
                    INNER JOIN cake   -- テーブル3
                    ON o_qtt.cake_id = cake.id;
                    """;
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
        return result;
    }

    List<Map<String, Object>> select7() {
        String sql = "SELECT * FROM cake";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
        return result;
    }

    String orderT(String time_id){
        String sql_time = "INSERT INTO o_time(id) VALUES(?)";
        int count_time = jdbcTemplate.update(sql_time, time_id);
        return ("" + count_time);
    }

    String orderQtt(String time_id,  int cake_id, int quantity){
        String sql_qtt = "INSERT INTO o_qtt(time_id, cake_id, quantity) VALUES(?, ?, ?)";
        int count_qtt = jdbcTemplate.update(sql_qtt, time_id, cake_id, quantity);
        return ("" + count_qtt);
    }
}
```

# ステップ2-4
### コントローラーを完成させる
## CakeShop.java
```
package com.example.demo;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@SpringBootApplication
@Controller
public class CakeShop {
    public static void main(String[] args) {
        SpringApplication.run(CakeShop.class, args);
    }

    private final CakeDao dao;

    CakeShop(CakeDao dao) {
        this.dao = dao;
    }

    @RequestMapping("/")
    String home(Model model) {
        List<Map<String, Object>> cakeList = dao.select7();
        // System.out.println(cakeList); <--確認コード
        model.addAttribute("cakeList", cakeList);
        return "cakeshop3"; // ビューの名前
    }

    @RequestMapping("/order")
    String order(@RequestParam("id") List<Integer> ids,@RequestParam("count") List<Integer> counts) {
        String time_id = UUID.randomUUID().toString().substring(0, 8);  // 2.4節で紹介されたUUID
        dao.orderT(time_id);
        for(int i = 0; i<counts.size(); i++){
            if(counts.get(i) > 0){
                dao.orderQtt(time_id, ids.get(i), counts.get(i));
            }
        }
        return "redirect:/";
    }
}

```