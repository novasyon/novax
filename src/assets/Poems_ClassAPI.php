<?php

/**
 * Description of Poems_Class
  Updated on 10/21/2015
 * http://novasyon.net/
 * Handle all the poems needs (main site and mobile)
 * 12/20/2011
 *
 * @author louis
 */
class Poems_Class {
    var $Base_url = "../";    
    var $col_en = "english"; //colum o quote text
    var $col_fr = "french";
    var $col_ht = "creole";
    var $col_es = "spanish";
    var $col_cu = "english"; //current column
    var $theme_str= "theme"; 
    var $last_poemID = 100;
    var $logged_in = false;
    var $module = "poem"; /* ..., quote,citation, riddle, */
    var $modules = "poems"; /* ..., quotes,citations, riddles, */
    var $next_quot = 3;
    var $next_quote = 3;
    var $page_desc = "poem";
    var $pageStr = "Page";
    var $page_keywords = "poem";
    var $page_title = "poem";
    var $pid = 0;
    var $quoteStr = "poem";
    var $p_url = "";
    var $n_table = "";
    var $strPoemID = "poem";
    var $xml; /*Holding the language variables from the XML language file*/
    var $lang = "en";
    var $lang2 = "en_US";    
    var $poem_table = "poems_en";
    var $pid_str = 0;
    var $next_poem = 3;
    var $poemID = 0; /* current poem ID */
    var $poem_lang = "en"; /* current poem language */
    var $poem_categ = "love"; /* current poem category */
    var $prev_poem = 1;
    var $link = "";
	var $response = array();

   
    /* Change the variables in English, French, Creole or Spanish */
    function __construct($lang, $module, $Base_url = null) {
        $this->lang = $lang;
        $this->module = $module;
        $this->Base_url = $Base_url;
        switch ($module) {
            case "poem": $this->modules = "API".$module . "s";
                $this->poem_table = "poems_en";
                $this->col_cu = "english";
                $this->random_str = "random";
                $this->tags_str = "tags";
                $this->pageStr = "Page";
                $this->xml = simplexml_load_file($Base_url . 'includes/languages/stringsEN.xml') or die("Error: Cannot create language object");
                break;
            case "poeme": $this->modules = "API".$module . "s";
                $this->poem_table = "poems_fr";
                $this->col_cu = "french";
                $this->random_str = "au_hasard";
                $this->tags_str = "mots_cles";
                $this->pageStr = "Page";
                $this->xml = simplexml_load_file($Base_url . 'includes/languages/stringsFR.xml') or die("Error: Cannot create language object");
                break;
            case "powem": $this->modules = "API".$module;
                $this->poem_table = "poems_ht";
                $this->col_cu = "creole";
                $this->random_str = "pa_aza";
                $this->tags_str = "mo_kle";
                $this->pageStr = "Paj";
                $this->xml = simplexml_load_file($Base_url . 'includes/languages/stringsHT.xml') or die("Error: Cannot create language object");
                break;
            case "poema": $this->modules = "API".$module . "s";
                $this->poem_table = "poems_es";
                $this->col_cu = "spanish";
                $this->random_str = "al_azar";
                $this->tags_str = "palabras_clave";
                $this->pageStr = "Pagina";
                $this->xml = simplexml_load_file($Base_url . 'includes/languages/stringsES.xml') or die("Error: Cannot create language object");
                break;
            default: $this->modules = "API".$module . "s";
                $this->poem_table = "poems_en";
                $this->col_cu = "english";
                $this->random_str = "random";
                $this->tags_str = "tags";
                $this->pageStr = "Page";
                $this->xml = simplexml_load_file($Base_url . 'includes/languages/stringsEN.xml') or die("Error: Cannot create language object");
                break;
        }
        if(isset($_GET['admin']))
            if(isset($_GET['table'])) $this->poem_table = "poems";
            
        $this->setDatabase();
        $this->setDescription();
    }
    
    /* Description that can be used for page description */
    public function setDescription() {
        switch ($this->module) {
            case "poem": case "poems": $this->page_title = "Novasyon Poems";
                break;
            case "poeme": case "poemes": $this->page_title = "Novasyon Poèmes";
                break;
            case "powem": $this->page_title = "Novasyon Powèm";
                break;
            case "poema": case "poemas": $this->page_title = "Novasyon Poemas";
                break;
            default: $this->page_title = "Novasyon Poems";
                $this->page_desc = "Novasyon Poems";
                break;
        }
        if (isset($_GET['letter'])) {
            $letter = $_GET['letter'];
            $this->page_title = $this->page_title . " - $letter";
            switch ($this->module) {
                case "poem": case "poems": $this->page_desc = "Find nice poems and beatiful wisdom sayings in Novasyon that start with the letter $letter.";
                    break;
                case "poeme": case "poemes": $this->page_desc = "Trouver de beaux poemes et des paroles de sagesse sur Novasyon qui commencent avec la lettre $letter.";
                    break;
                case "powem": $this->page_desc = "W ap jwenn bèl powèm lakay ak pawòl sajès sou Novasyon ki kòmanse ak lèt $letter.";
                    break;
                case "poema": case "poemas": $this->page_desc = "Encuentra poemas agradables y bellas palabras de sabiduría en Novasyon que comiencan con la lettra $letter.";
                    break;
                default: $this->page_desc = "Novasyon Poems";
                    break;
            }
        } elseif (isset($_GET['poem'])) {
            $sql_poem = $this->link->query("select * FROM $this->poem_table where id = " . intval($_GET['poem']));
            while ($row = $sql_poem->fetch(PDO::FETCH_ASSOC)) {
                $this->page_desc = $this->page_title . ": " . $row['title'];
                $this->page_title = $row['title'] . " | " . $this->page_title;
            }
        } elseif (isset($_GET['poeme'])) {
            $sql_poem = $this->link->query("select * FROM $this->poem_table where id = " . intval($_GET['poeme']));
            while ($row = $sql_poem->fetch(PDO::FETCH_ASSOC)) {
                $this->page_desc = $this->page_title . ": " . $row['title'];
                $this->page_title = $row['title'] . " | " . $this->page_title;
            }
        } elseif (isset($_GET['powem'])) {
            $sql_poem = $this->link->query("select * FROM $this->poem_table where id = " . intval($_GET['powem']));
            while ($row = $sql_poem->fetch(PDO::FETCH_ASSOC)) {
                $this->page_desc = $this->page_title . ": " . $row['title'];
                $this->page_title = $row['title'] . " | " . $this->page_title;
            }
        } elseif (isset($_GET['poema'])) {
            $sql_poem = $this->link->query("select * FROM $this->poem_table where id = " . intval($_GET['poema']));
            while ($row = $sql_poem->fetch(PDO::FETCH_ASSOC)) {
                $this->page_desc = $this->page_title . ": " . $row['title'];
                $this->page_title = $row['title'] . " | " . $this->page_title;
            }
        } elseif (isset($_GET['themes'])) {
            //getByCategory();
        } else {
            switch ($this->module) {
                case "poem": case "poems": $this->page_desc = "Find nice poems and beatiful wisdom sayings in Novasyon. Add your own poems and share with your friends.";
                    break;
                case "poeme": case "poemes": $this->page_desc = "Trouver de beaux poemes et des paroles de sagesse sur Novasyon. Ajouter vos propres poemes et partager avec vos amis.";
                    break;
                case "powem": $this->page_desc = "W ap jwenn bèl powèm lakay ak pawòl sajès sou Novasyon. Ajoute powèm ou konnen tou e pataje ak zanmi w";
                    break;
                case "poema": case "poemas": $this->page_desc = "Encuentra poemas agradables y bellas palabras de sabiduría en Novasyon. Añada sus propios poemas y compartir con sus amigos.";
                    break;
                default: $this->page_desc = "Novasyon Poems";
                    break;
            }
        }
    }

    function setDatabase() {
        $db = "novasyon_nova";        
        include $this->Base_url . "includes/config.inc.php";
        $this->link = new PDO("mysql:host=localhost;dbname=$db;charset=utf8", $dbuser, $dbpassword);
    }
    
/* Function to show different different option 
     * Default function called after Construct */
    function show($option = null) {
        $id = 0;
        
        if (isset($_GET['add']) || isset($_GET['ajouter']) || isset($_GET['ajoute']) || isset($_GET['anadir']) ) {
            $this->add();
        } elseif (isset($_GET['manage'])) {
            echo "Managing...";
			$sql_poem = $this->link->query("SELECT * FROM `poems_en`") ;
			while ($row = $sql_poem->fetch(PDO::FETCH_ASSOC)) {
            echo "<a class='list-group-item' href='./$this->modules.php?$this->module=$row[id]'>" . $row['author']." "."</a>";
            $sql_poem1 = $this->link->query("SELECT * FROM `users` WHERE `pseudo` LIKE '".$row['author']."'") ;
			   while ($row1 = $sql_poem1->fetch(PDO::FETCH_ASSOC)) {
                      echo "SELECTED ".$row1['pseudo']." <br/>";
			   }/**/
			$this->link->query("UPDATE `users` SET poems_count = poems_count+1 WHERE pseudo LIKE '".$row['author']."'") ;
			//echo "Updated";
        }
        }elseif (isset($_GET['poem'])) {
            if (is_numeric($_GET['poem'])) {
                $this->poemID = $_GET['poem'];
                $this->getByID();
            } else {
                $this->showPoems();
            }
        } elseif (isset($_GET['poeme'])) {
            if (is_numeric($_GET['poeme'])) {
                $this->poemID = $_GET['poeme'];
                $this->getByID();
            } else {
                $this->showPoems();
            }
        } elseif (isset($_GET['powem'])) {
            if (is_numeric($_GET['powem'])) {
                $this->poemID = $_GET['powem'];
                $this->getByID();
            } else {
                $this->showPoems();
            }
        } elseif (isset($_GET['poema'])) {
            if (is_numeric($_GET['poema'])) {
                $this->poemID = $_GET['poema'];
                $this->getByID();
            } else {
                $this->showPoems();
            }
        } elseif (isset($_GET['tags']) || isset($_GET['mots_cles']) || isset($_GET['mo_kle']) || isset($_GET['palabras_claves'])) {
            $this->showTags();
        } elseif (isset($_GET['tag']) or isset($_GET['mot_cle']) || isset($_GET['palabra_clave']) or isset($_GET['mot_cle']) or isset($_GET['q'])) {
            $this->getByKeywords();
        } elseif (isset($_GET['letter']) || isset($_GET['lettre']) || isset($_GET['let']) || isset($_GET['lettra'])) {
            $this->showByLetters();
        } elseif (isset($_GET['random']) || isset($_GET['au_hasard']) || isset($_GET['pa_aza']) || isset($_GET['al_azar'])) {
            $this->somePoems(10, "RAND()"); /* show 10 random poems */
        } elseif (isset($_GET['theme']) || isset($_GET['themes']) || isset($_GET['tem']) || isset($_GET['tem_yo']) || isset($_GET['tema']) || isset($_GET['temas'])) {
            $this->getByCategory();
        }  elseif (isset($_GET['latest']) || isset($_GET['recents']) || isset($_GET['denye']) || isset($_GET['ultimos'])) {
            $this->ShowLatest();
        }  elseif (isset($_GET['users']) || isset($_GET['utilisateurs']) || isset($_GET['itilizate']) || isset($_GET['usuarios'])) {
            $this->showUsers();
        } elseif (isset($_GET['user']) || isset($_GET['utilisateur']) || isset($_GET['itilizate']) || isset($_GET['usario'])) {
            $this->showUserPoems();
        } elseif ($option == "random") {
            $this->randomPoems();
        } else {
            $this->showPoems(); /* default: show some Poems */
        }
    }/* END show() */

  
    /**
     * showMenu */
    public function showMenu() {
        echo "";
    }

    /* Return category name depending on Category ID and Language */
    public function getPoemCateg($categID, $lang = null) {
        if ($categID == 0)
            return "";
        $sql = $this->link->query("SELECT * FROM `poem_category` WHERE `id` =$categID");
        while ($rowc = $sql->fetch(PDO::FETCH_ASSOC)) {
            $categn = $rowc[$lang];
        }
        return $categn;
    }

    /* Search by keywords or tags */
    public function getByKeywords() {
        if (isset($_GET['tag'])) {
            $q = $_GET['tag'];
            $query = "SELECT * FROM $this->poem_table WHERE MATCH (`keywords`) AGAINST ('$q') ";
        } elseif (isset($_GET['q'])) {
            $q = $_GET['q'];
            if ($q != "") {
                $query = "SELECT * FROM $this->poem_table WHERE MATCH (`title`,`poem_txt`,`keywords`) AGAINST ('$q') ";
            }
        }
        $sql_poem = $this->link->query($query) or die("MySQL error [line " . __LINE__ . "]: " . mysql_error());
        while ($rowc = $sql_poem->fetch(PDO::FETCH_ASSOC)) {
                $data = str_replace(array("&nbsp;", "<br />", "<b>", "</b>", "<font color= red >", "</font>", "\r", "\u", "--", "<br>", ",", "\u00e8s", "'", "\u00e8s", "\u0092"), "", array_map('utf8_encode', $rowc));
                array_push($this->response, $data);
            }
			
	$this->response = json_encode($this->response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    echo utf8_decode($this->response);
    }

    /* get Poems By Category */
    function getByCategory() {
        if (isset($_GET['themes']) || isset($_GET['tem_yo']) || isset($_GET['temas'])) {
            $tl = $this->lang;
			 
            $sql_poemc = $this->link->query("SELECT `id`, `$tl` FROM `poem_category` ORDER BY `$tl` ASC");
            
            while ($rowc = $sql_poemc->fetch(PDO::FETCH_ASSOC)) {
                $data = str_replace(array("&nbsp;", "<br />", "<b>", "</b>", "<font color= red >", "</font>", "\r", "\u", "--", "<br>", ",", "\u00e8s", "'", "\u00e8s", "\u0092"), "", array_map('utf8_encode', $rowc));
                array_push($this->response, $data);
            }
            
        } else { 
            
            if (isset($_GET['theme'])) {
                $tag = $_GET['theme'];
            } elseif (isset($_GET['tem'])) {
                $tag = $_GET['tem'];
            } elseif (isset($_GET['tema'])) {
                $tag = $_GET['tema'];
            } else {
                $tag = 1;
            } 
           
                $sql_poem = $this->link->query("select * FROM $this->poem_table where `category` = " . $tag . " ORDER BY `title` ASC");
                while ($row = $sql_poem->fetch(PDO::FETCH_ASSOC)) {
                    //echo "<a class='list-group-item' href='./$this->modules.php?$this->module=$row[id]'>" . $row['title'] . "</a>";
					$data = str_replace(array("&nbsp;", "<br />", "<b>", "</b>", "<font color= red >", "</font>", "\r", "\u", "--", "<br>", ",", "\u00e8s", "'", "\u00e8s", "\u0092"), "", array_map('utf8_encode', $row));
                    array_push($this->response, $data);
                
               
			   
            }			
        }
		$this->response = json_encode($this->response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            echo utf8_decode($this->response);
    }/* END getByCategory */

    function editPoem() {
        if (isset($_GET['update']))
            $option = "update";
        elseif (isset($_GET['edit']))
            $option = "edit";
        else
            $option = "nada"; //Nothing
        if (isset($_GET['id']))
            $id = $_GET['id'];
        else
            $id = 0;
        $thanx = "";
        // include ($this->Base_url . "includes/fonctions.php");
        if ($option == "update" && $id != 0) {
            $poem = convertLatin1ToHtml($_POST['poem']);
            $def = convertLatin1ToHtml($_POST['def']);
            $langto1 = convertLatin1ToHtml($_POST['langto1']);
            $langto2 = convertLatin1ToHtml($_POST['langto2']);
            $langto3 = convertLatin1ToHtml($_POST['langto3']);

            $note = convertLatin1ToHtml($_POST['note']);
            $keywords = convertLatin1ToHtml($_POST['keywords']);
            $group = $_POST['group'];
            /*
             * UPDATE  `nova_verbs`.`poems` SET
             * `keywords` =  'penny, ' WHERE  `poems`.`id` =1
             * AND  `poems`.`text` =  'A bad penny always turns up.'
             * AND  `poems`.`keywords` =  'penny, bad'
             * AND `poems`.`group` =  '0' AND  `poems`.`langto1` =  '' AND  `poems`.`langto2` =  '' AND  `poems`.`langto3` =  '' AND  `poems`.`note` =  '' AND  `poems`.`def` = 'Your mistakes will come back to haunt you. OR Bad people will always return.' LIMIT 1 ;
             */
            $sql_update = mysql_query("update $this->poem_table set
`poem_txt` ='$poem', `def` ='$def',
`langto1` ='$langto1', `langto2` ='$langto2', `langto3` ='$langto3',
`note` ='$note', keywords ='$keywords', `group` ='$group' where `id`='$id'") or die(mysql_error());
            echo $this->updated_success . "<br /><a href='$this->modules.php'>$this->main</a>";
            /* Show edited poemes */
            if ($option == "update" && $id != 0) {
                $sql_edit = mysql_query("select * FROM $this->poem_table where id='$id'") or die("MySQL error 13: " . mysql_error());
                while ($row = mysql_fetch_array($sql_edit)) {
                    $id = $row['id'];
                    $poem = $row['poem_txt'];
                    $def = $row['def'];
                    $langto1 = $row['langto1'];
                    $langto2 = $row['langto2'];
                    $langto3 = $row['langto3'];
                    $note = $row['note'];
                    $keywords = $row['keywords'];
                    $group = $row['group'];
                }
                ?>
                <form id="monForm" method="post" action="?case=3&amp;update&id=<?php echo $id; ?>" name="updatepoem">
                    <table border="0" cellspacing="0" cellpadding="3" width="450px">
                        <tbody><tr>
                                <td valign="top"></td>
                                <td valign="top">
                                    <font color="blue"><?php echo $thanx; ?></font>
                                </td></tr>
                            <tr><td>
                                    <label for="lang"><?php echo $this->table; ?></label></td><td>
                            <?php echo poems; ?></td></tr>
                            <tr><td><label for="poem"><?php echo $this->poem; ?></label></td><td><textarea name="poem" rows="2" cols="50"><?php echo $poem; ?></textarea></td></tr>
                                <tr><td><label for="keywords"><?php echo $this->keywords; ?></label></td><td><input type="text" name="keywords" size="45" value="<?php echo $keywords; ?>" /></td></tr>
                                <tr><td><label for="def"><?php echo $this->meaning; ?></label></td><td><textarea name="def" rows="2" cols="50"><?php echo $def; ?></textarea></td></tr>
                                <tr><td><label for="langto1"><?php echo $this->lang_to1; ?></label></td><td><textarea name="langto1" rows="2" cols="50"><?php echo $langto1; ?></textarea></td></tr>
                                <tr><td><label for="langto2"><?php echo $this->lang_to2; ?></label></td><td><textarea name="langto2" rows="2" cols="50"><?php echo $langto2; ?></textarea></td></tr>
                                <tr><td><label for="langto3"><?php echo $this->lang_to3; ?></label></td><td><textarea name="langto3" rows="2" cols="50"><?php echo $langto3; ?></textarea></td></tr>
                                <tr><td><label for="group">Group</label></td><td><input type="text" name="group" size="45" value="<?php echo $group; ?>" /></td></tr>
                                <tr><td><label for="note">Note</label></td><td><input type="text" name="note" size="45" value="<?php echo $note; ?>" /></td></tr>
                                <tr><td></td><td><input type="submit" value="<?php echo $this->submit; ?>" name="Submit" />&nbsp;<input type="reset" value="<?php echo $this->reset; ?>" name="Reset" /></td></tr>
                                </tbody>
                                </table>
                                </form>
                <?php
            }
        } elseif ($option == "edit" && $id != 0) {
            $sql_edit = mysql_query("select * FROM $this->poem_table where id='$id'") or die("MySQL error 14: " . mysql_error());
            while ($row = mysql_fetch_array($sql_edit)) {
                $id = $row['id'];
                $poem = $row['poem_txt'];
                $def = $row['def'];
                $langto1 = $row['langto1'];
                $langto2 = $row['langto2'];
                $langto3 = $row['langto3'];
                $note = $row['note'];
                $keywords = $row['keywords'];
                $group = $row['group'];
            }
            ?>
                        <form id="monForm" method="post" action="?case=3&amp;update&id=<?php echo $id; ?>" name="updatepoem">
                        <table border="0" cellspacing="0" cellpadding="3" width="450px">
                        <tbody><tr>
                        <td valign="top"></td>
                        <td valign="top">
                        <font color="blue"><?php echo $thanx; ?></font>
                        </td></tr>
                        <tr><td>
                        <label for="lang"><?php echo $this->table; ?></label></td><td>
                        <?php echo poems; ?></td></tr>
                        <tr><td><label for="poem"><?php echo $this->poem; ?></label></td><td><textarea name="poem" rows="2" cols="50"><?php echo $poem; ?></textarea></td></tr>
                        <tr><td><label for="keywords"><?php echo $this->keywords; ?></label></td><td><input type="text" name="keywords" size="45" value="<?php echo $keywords; ?>" /></td></tr>
                        <tr><td><label for="def"><?php echo $this->meaning; ?></label></td><td><textarea name="def" rows="2" cols="50"><?php echo $def; ?></textarea></td></tr>
                        <tr><td><label for="langto1"><?php echo $this->lang_to1; ?></label></td><td><textarea name="langto1" rows="2" cols="50"><?php echo $langto1; ?></textarea></td></tr>
                        <tr><td><label for="langto2"><?php echo $this->lang_to2; ?></label></td><td><textarea name="langto2" rows="2" cols="50"><?php echo $langto2; ?></textarea></td></tr>
                        <tr><td><label for="langto3"><?php echo $this->lang_to3; ?></label></td><td><textarea name="langto3" rows="2" cols="50"><?php echo $langto3; ?></textarea></td></tr>
                        <tr><td><label for="group">Group</label></td><td><input type="text" name="group" size="45" value="<?php echo $group; ?>" /></td></tr>
                        <tr><td><label for="note">Note</label></td><td><input type="text" name="note" size="45" value="<?php echo $note; ?>" /></td></tr>
                        <tr><td></td><td><input type="submit" value="<?php echo $this->submit; ?>" name="Submit" />&nbsp;<input type="reset" value="<?php echo $this->reset; ?>" name="Reset" /></td></tr>
                        </tbody>
                        </table>
                        </form>
            <?php
        } else {
            echo $this->error_id_wrong; /* ... or missing */
        }
    }

    /**
     * cutPrahse cut the string without cutting words */
    function cutPrahse_($string, $max_length) {
        if (strlen($string) > $max_length) {
            $string = substr($string, 0, $max_length);
            $pos = strrpos($string, " ");
            if ($pos === false) {
                return substr($string, 0, $max_length) . "...";
            }
            return substr($string, 0, $pos) . "...";
        } else {
            return $string;
        }
    }/* END cutPrahse */
    

/*  showPoems*/
    public function showPoems() {
        $nombreDeMessagesParPage = 15;
        $page = (isset($_GET['page']) ? $_GET['page'] : 1);
        $page = intval($page);
        $gletter = (isset($_GET['letter']) ? $_GET['letter'] : "");

        if ($gletter != "") {
            $gletter = $gletter[0];
            $letter = "title like '" . $gletter . "%'";
        } else {
            $letter = "title like 'A%'";
            $_GET['letter'] = "";
        }
        $sql_poem = $this->link->query("select count(*) FROM $this->poem_table");
        $totalDesMessages = $sql_poem->fetchColumn();
        $nombreDePages = ceil($totalDesMessages / $nombreDeMessagesParPage);
        $premierMessageAafficher = ($page - 1) * $nombreDeMessagesParPage;
        $sql_poem = $this->link->query("select * FROM $this->poem_table ORDER BY title LIMIT $premierMessageAafficher, $nombreDeMessagesParPage"); 
		
        while ($row = $sql_poem->fetch(PDO::FETCH_ASSOC)) {
            
			$data = str_replace(array("&nbsp;", "<br />", "<b>", "</b>", "<font color= red >", "</font>", "\r", "\u", "--", "<br>", ",", "\u00e8s", "'", "\u00e8s", "\u0092"), "", array_map('utf8_encode', $row));
                    array_push($this->response, $data);
        }
        
	   $this->response = json_encode($this->response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            echo utf8_decode($this->response);
	   
    }

/*  showByLetters*/
    public function showByLetters() {
        
        $nombreDeMessagesParPage = 15;
        $page = (isset($_GET['page']) ? $_GET['page'] : 1);
        $page = intval($page);
        $gletter = (isset($_GET['letter']) ? $_GET['letter'] : "");

        if ($gletter == "*") {
            $gletter = $gletter[0];
            $letter = "";
        }elseif ($gletter != "") {            
			$gletter = $gletter[0];
            $letter = "where title like '" . $gletter . "%'";
        } else {
            $letter = "where title like 'A%'";
            $_GET['letter'] = "";
        }
      
        $sql_poem = $this->link->query("select * FROM $this->poem_table $letter ORDER BY title");
        while ($row = $sql_poem->fetch(PDO::FETCH_ASSOC)) {           
			$data = str_replace(array("&nbsp;", "<br />", "<b>", "</b>", "<font color= red >", "</font>", "\r", "\u", "--", "<br>", ",", "\u00e8s", "'", "\u00e8s", "\u0092"), "", array_map('utf8_encode', $row));
                    array_push($this->response, $data);
        }
        
	   $this->response = json_encode($this->response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            echo utf8_decode($this->response);
	   
    }

//Fonction listant les pages<li><a href="#">2</a></li>
 function get_list_page($page, $nb_page, $link, $nb = 4) {
        $list_page = array();
        for ($i = 1; $i <= $nb_page; $i++) {
            if (($i < $nb) OR ( $i > $nb_page - $nb) OR ( ($i < $page + $nb) AND ( $i > $page - $nb)))
                $list_page[] = ($i == $page) ? '<li class="active"><a href="#">' . $i . '</a></li>' : '<li><a href="' . $link . '&amp;page=' . $i . '"> ' . $i . ' </a></li>';
            else {
                if ($i >= $nb AND $i <= $page - $nb)
                    $i = $page - $nb;
                elseif ($i >= $page + $nb AND $i <= $nb_page - $nb)
                    $i = $nb_page - $nb;
                $list_page[] = '...';
            }
        }
        $print = implode(' ', $list_page);
        return $print;
    }

    FUNCTION getByID($UserId = null, $s = null) {
        $this->setPrevNext_poem($this->poemID);
        echo '<div class="Blogpost">';
        $sql_poem = $this->link->query("select * FROM $this->poem_table where id = $this->poemID");
        while ($row = $sql_poem->fetch(PDO::FETCH_ASSOC)) {
            $this->page_desc = $this->page_title . ": " . $row['title'];
            $this->page_title = $row['title'] . " | " . $this->page_title;
            $this->poem_categ = $row['category'];
            $this->poem_lang = $this->lang;
            $categid = (is_numeric($row['category']) ? $row['category'] : 0);
            $categn = $this->getPoemCateg($categid, $this->lang);

            echo '<div class="heading-title heading-border">';
            echo "<h2 class='font-khausan-script' >$row[title]</h2>";
            echo '<ul class="list-inline categories nomargin">              
              <li><i class="fa fa-clock-o"></i> <span class="font-lato">' . $this->formatTime($row["date"]) . '</span></li> 
              <li> <a href="./' . $this->modules . '.php?theme=' . $categid . '&t=' . $categn . '"><i class="fa fa-folder-open-o"></i> <span class="font-lato">' . $categn . '</span></a></li>              
              <li><a href="./' . $this->modules . '.php?user=' . $row['author_id'] . '&t=' . $row['author'] . '"><i class="fa fa-user"></i> <span class="font-lato">' . $row['author'] . '</span></a></li>
              <li><i class="fa fa-tag"></i> <span class="font-lato">' . $this->format_tag($row['keywords']) . '</span></li>
              </ul></div>';
            echo '<p class="font-khausan-script size-20">' . $row['poem_txt'] . '</p>';
            //echo '<ul class="pager"><li class="previous"><a href="./'.$this->module.'-'.$this->prev_poem.'" title="'.$this->xml->poem_previous.'"><i class="icon-large icon-chevron-left"> '.$this->xml->poem_previous.'</i></a></li>';
//echo '<li class="previous"><a href="./' . $this->modules. '.php?random' .'" title="' . $this->xml->poems_random . '"><i class="icon-large icon-random"> ' . $this->xml->poems_random . '</i></a></li>';
            //echo '<li class="next"><a href="./' . $this->module . '-' . $this->next_poem.'" title="'.$this->xml->poem_next.'"> ' .$this->xml->poem_next. ' <i class="icon-large icon-chevron-right"></i></a></li> </ul></div>';
                          // echo "<div class='fb-comments' data-href='http://novasyon.net/$this->lang/$this->module-$row[id]' data-numposts='5' width='100%'></div>";  
        }
    }

/* END FUNCTION getByID */

    /**
     * someProverbs
     * @param type $num
     * @param type $order
     * @param type $id
     */
    public function somePoems($num = null, $order = null, $id = null) {
        if (intval($this->poemID) > 0) {
            $sql_prov = $this->link->query("select * FROM $this->poem_table WHERE id > " . $this->poemID . " LIMIT " . $num);
        } else {
            $sql_prov = $this->link->query("select * FROM $this->poem_table ORDER BY " . $order . " LIMIT " . $num);
        }
        while ($row = $sql_prov->fetch(PDO::FETCH_ASSOC)) {           
			$data = str_replace(array("&nbsp;", "<br />", "<b>", "</b>", "<font color= red >", "</font>", "\r", "\u", "--", "<br>", ",", "\u00e8s", "'", "\u00e8s", "\u0092"), "", array_map('utf8_encode', $row));
                    array_push($this->response, $data);
        }
        
	   $this->response = json_encode($this->response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            echo utf8_decode($this->response);
    }

    /* show Poems of a user */

    public function showUserPoems() {
    if (isset($_GET['t']))
    $username=$_GET['t']; else $username="";
    
        if (isset($_GET['user'])) {
            $user_id = $_GET['user'];
        } elseif (isset($_GET['utulisateur'])) {
            $user_id = $_GET['utulisateur'];
        } elseif (isset($_GET['itilizate'])) {
            $user_id = $_GET['itilizate'];
        } elseif (isset($_GET['usario'])) {
            $user_id = $_GET['usario'];
        } else {
            $user_id = 0; /* No user */
        }
        $user = intval($user_id);
        if ($user > 0)
            $sql_prov = $this->link->query("select * FROM $this->poem_table WHERE `author_id` =" . $user . " ORDER BY `title` ASC");
        elseif (isset($_GET['t']))
            $sql_prov = $this->link->query("select * FROM $this->poem_table WHERE `author` like '" . $username . "' ORDER BY `title` ASC");
        else
            $sql_prov = "";
        echo '<div class="list-group">';
        echo '<a href="#" class="list-group-item active">' . $this->xml->poem_list . ' [' . $username . ']</a>';
        while ($row = $sql_prov->fetch(PDO::FETCH_ASSOC)) {
            echo "<a class='list-group-item'  href='./" . $this->modules . ".php?" .$this->module."=".$row['id'] . "' >" . $row['title'] . "</a>";
        }
        echo "</div>";
    }

public function showUsers() {
        
        $sql_prov = $this->link->query("select * FROM users ORDER BY `pseudo` ASC");
        
        echo '<div class="list-group">';
        echo '<a href="#" class="list-group-item active"> Users :</a>';
        while ($row = $sql_prov->fetch(PDO::FETCH_ASSOC)) {
            echo "<a class='list-group-item'  href='./" . $this->modules . ".php?user&t=" . $row['pseudo'] . "' >" . $row['pseudo'] ." ". $row['name'] ." [". $row['poems_count'] ."]<a/>";
        }
        echo "</div>";
    }


    function getRealIpAddr() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {   //check ip from share internet
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {   //to check ip is pass from proxy
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

    public function getDescription() {
        return $this->page_desc;
    }

    public function getTitle() {
        return $this->page_title;
    }


    /* format_tag($tags) */
    function format_tag($tags) {
        $tagsa = explode(",", $tags);
        sort($tagsa);
        $tagsb = "";
        for ($i = 0; $i < count($tagsa); $i++) {
            if ($i > 0)
                $tagsb = $tagsb . ", ";
            $tagx = trim($tagsa[$i]);
            $tagsb = $tagsb . "<a href='./$this->modules.php?tag=$tagx'>$tagsa[$i]</a>";
        }
        return $tagsb;
    }/* END format_tag */


    /* Return formated time */
    function formatTime($timestamp, $lang = null) {
        if ($lang == null) {
            $lang = $this->lang;
        }
        switch ($lang) {
            case "fr": setlocale(LC_TIME, 'fr');
                $time = strftime('%d %B %Y', $timestamp);
                break;
            case "ht": $time = date('d/m/Y', $timestamp);
                break;
            case "es": setlocale(LC_TIME, 'es');
                $time = strftime('d/m/y', $timestamp);
                break;
            default: setlocale(LC_TIME, 'en');
                $time = strftime('%B %d, %Y', $timestamp);
                break;
        }
        return $time;
    }/* END format_tag */


    /* showTags */
    function showTags() {
        $sql_q = $this->link->query("SELECT `keywords` FROM $this->poem_table");
        $storeArray = Array();
        $i = 0;
        $tags = $sql_q->fetch(PDO::FETCH_ASSOC);
        while ($row = $sql_q->fetch(PDO::FETCH_ASSOC)) {
            if (strpos($row['keywords'], ",")) {
                $storeArray0[] = explode(",", strtolower($row['keywords']));
            } else {
                $storeArray0[] = explode(" ", strtolower($row['keywords']));
            }
        }
        $storeArray = array_filter($storeArray0);
        $storeArray = $this->arrayFlatten($storeArray);
        $storeArray = array_values(array_filter($storeArray));
        sort($storeArray); // sort the tags alphabetically
        
		$data = str_replace(array("&nbsp;", "<br />", "<b>", "</b>", "<font color= red >", "</font>", "\r", "\u", "--", "<br>", ",", "\u00e8s", "'", "\u00e8s", "\u0092"), "", array_map('utf8_encode', $storeArray));
             array_push($this->response, $data);
		$this->response = json_encode($this->response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        echo utf8_decode($this->response);
    }

/* END showTags */

    function arrayFlatten($array) {
        $flattern = array();
        foreach ($array as $key => $value) {
            $new_key = array_keys($value);
            $flattern[] = $value[$new_key[0]];
        }
        return $flattern;
    }

    /* <div class="img-hover"><a href="blog-single-default.html">
      <img class="img-responsive" src="http://localhost/html/assets/images/demo/451x300/24-min.jpg" alt=""></a>
      <h4 class="text-left margin-top-20"><a href="blog-single-default.html">Lorem Ipsum Dolor</a></h4>
      <p class="text-left">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate, asperiores quod est tenetur in.</p>
      <ul class="text-left size-12 list-inline list-separator">
      <li><i class="fa fa-calendar"></i>29th Jan 2015</li>
      <li><a href="blog-single-default.html#comments"><i class="fa fa-comments"></i>3</a></li>
      </ul>
      </div> */
    /* Random items to show on the main page */

    /**
     *
     */
    public function add() {
        $error = 0; $errors = 0;  $errorstr=""; $category[] = 0;
        
        if (!isset($_SESSION["author"]))
            $_SESSION["author"] = null;
        elseif (isset($_POST["author"]))
            $_SESSION["author"] = $_POST["author"]; 
        if (!isset($_SESSION["text"]))
            $_SESSION["text"] = null;
        elseif (isset($_POST["text"]))
            $_SESSION["text"] = $_POST["text"];        
        if (!isset($_SESSION["email"]))
            $_SESSION["email"] = null;
        elseif (isset($_POST["email"]))
            $_SESSION["email"] = $_POST["email"];
        if (!isset($_SESSION["keywords"]))
            $_SESSION["keywords"] = null;
        elseif (isset($_POST["keywords"]))
            $_SESSION["keywords"] = $_POST["keywords"];
        if (!isset($_SESSION["category"]))
            $_SESSION["category"] = null;
        elseif (isset($_POST["category"]))
            $_SESSION["category"] = $_POST["category"];        
        if (!isset($_SESSION["title"]))
            $_SESSION["title"] = null;
        elseif (isset($_POST["title"]))
            $_SESSION["category"] = $_POST["title"];
        if (!isset($_SESSION["author_id"]))
            $_SESSION["author_id"] = null;
        elseif (isset($_POST["author_id"]))
            $_SESSION["url"] = $_POST["author_id"];
        if (!isset($_SESSION["image"]))
            $_SESSION["image"] = null;
        elseif (isset($_POST["image"]))
            $_SESSION["image"] = $_POST["image"];
        if (!isset($_SESSION["langp"]))
            $_SESSION["langp"] = $this->lang;
        elseif (isset($_POST["langp"]))
            $_SESSION["langp"] = $_POST["langp"];

        $last_update = time(); /*image name/ and time uploaded*/
        $sel_en = $sel_es = $sel_fr = $sel_ht = $thanx = null;        
        $this->poem_table = "poems";
        
        if (isset($_POST['text'])) {
            require_once ($this->Base_url . "includes/fonctions.php");
            $_SESSION['text'] = $text = convertLatin1ToHtml($_POST['text']);
            if ($_SESSION["text"] == "") {
                $thanx += $this->error_quote_add;
                $error++;
            } else {                
                $image = $_SESSION['image'];
                $categoryp = "";
                if(isset($_POST['category'])){
                    foreach ($_POST['category'] as $key) { $categoryp = $categoryp . $key .",";}
                }
                $keywords = convertLatin1ToHtml($_POST['keywords']);
                $title = convertLatin1ToHtml($_POST['title']);
                $author = convertLatin1ToHtml($_POST['author']);
                $author_id = $_POST['author_id'];
                $email = $_POST['email'];
                $langp = $_POST['langp'];
                $ip = $this->getRealIpAddr();
                define("MAX_SIZE", "100");//define a maxim size for the uploaded images in Kb
                                     
                    //Checking. reads the name of the file the user submitted for uploading
                    $image = $_FILES['image']['name']; $image_name = "";
                    
                    if ($image) {//if it is not empty
                        $max_width = 450;
                        $max_height = 300;
                        //$image = resizeImage($image, $max_width, $max_height);
                        //get the original name of the file from the clients machine
                        $filename = stripslashes($_FILES['image']['name']);
                        //get the extension of the file in a lower case format
                        $extension = getExtension($filename);
                        $extension = strtolower($extension);
                        //if it is not a known extension, we will suppose it is an error and will not upload the file, otherwize we will do more tests
                        if (($extension != "jpg") && ($extension != "jpeg") && ($extension != "png") && ($extension != "gif")) {
                            //print error message
                            $errorstr .= '<b>Unknown file extension!</b>';
                            $errors = 1;
                        } else {
                            //get the size of the image in bytes
                            //$_FILES['image']['tmp_name'] is the temporary filename of the file in which the uploaded file was stored on the server
                            $size = filesize($_FILES['image']['tmp_name']);
                            //compare the size with the maxim size we defined and print error if bigger
                            if ($size > MAX_SIZE * 1024) {
                                $errorstr .= '<b>You have exceeded the image size limit!</b>';
                                $errors = 1;
                            }                            
                            $image_name=$last_update.'.'.$extension;                            
                            $newname = "../images/poem/" . $image_name;
                            //we verify if the image has been uploaded, and print error instead                            
                           if($errors==0) $copied = copy($_FILES['image']['tmp_name'], $newname);
                            if (!$copied) {
                                $errorstr .= '<b>Image upload unsuccessfull!</b>';
                                $errors = 1;
                            }
                        }
                    }
                    
                if ($error <= 0) {
                    $text = nl2br($text);
                    $thanx = $this->xml->thank_you . " " . $this->xml->text_added_success." ".$errorstr;
                    //INSERT INTO `poems_en` (`id`, `image`, `title`, `category`, `author`, `author_id`, `date`, `poem_txt`, `views`, `rating`, `votes_count`, `keywords`, `email`, `ip`, `contest_id`)
                    $this->link->query("INSERT INTO $this->poem_table (`image`, `title`, `category`, `author`, `author_id`,`date`, `poem_txt`, `keywords`, `email`, `ip`, `langp`)
               Values ('$image_name','$title','$categoryp', '$author', '$author_id','$last_update', '$text', '$keywords','$email','$ip','$langp')")
                            or die("Add text ERROR : ". "<br />Error at line " . __LINE__ . " in file " . __FILE__);
                $_SESSION["image"] = $_SESSION["title"] = $_SESSION["category"] = $_SESSION["author"] = $_SESSION["author_id"] 
                        = $_SESSION["date"] = $_SESSION["keywords"] = $_SESSION["text"] = $_SESSION["image"] = null;
                
                } else { echo "Sorry, there was an error!"; }
                }
        }
        switch ($_SESSION['langp']) {
            case "en": $sel_en = "selected";
                break;
            case "fr": $sel_fr = "selected";
                break;
            case "ht": $sel_ht = "selected";
                break;
            case "es": $sel_es = "selected";
                break;
            default: break;
        }
        ?>
<!-- /add form -->
<form class="nomargin sky-form boxed"  id="form_add" enctype="multipart/form-data" method="post" action="?add&amp;submit" data-toastr-position="top-left">
<header><i class="fa fa-upload"></i> Upload a poem</header>
<?php if(isset($_GET['submit'])){ ?>
<font color="<?php
              if ($error > 0) {
                  $alert= "alert-danger"; $OKorNot="Oops, sorry!";
              } else{
                  $alert= "alert-success"; $OKorNot="Well done!";}
              ?>"></font>
<div class="alert <?php echo $alert; ?> margin-bottom-30">
	<button type="button" class="close" data-dismiss="alert">
		<span aria-hidden="true">×</span>
		<span class="sr-only">Close</span>
	</button>
<strong><?php echo $OKorNot; ?></strong> <?php echo $thanx;?>
</div><?php }?>
<p>~You must be the Author of poems you submit here.<br/>
~Use the enter key to create new lines.<br/>
~Spell Check your poem before you submit it.<br/>
~DO NOT SUBMIT POEMS IN ALL CAPS.<br/>
 N.B.: We will review the poem before we make it public.
</p>
<fieldset class="nomargin">		
    <label class="input margin-bottom-10"><i class="ico-append fa fa-user"></i><input id="author" name="author" required type="text" placeholder="Your name" value="<?php echo $_SESSION["author"]; ?>"></label>
    <input id="author_id" name="author_id" type="hidden">

<label class="input margin-bottom-10">
<i class="ico-append fa fa-envelope"></i><input id="email" name="email" type="email" required placeholder="Your email" value="<?php echo $_SESSION["email"]; ?>"><b class="tooltip tooltip-bottom-right">Needed to verify your account</b>
</label>

<div class="row margin-bottom-10">
<div class="col-md-8"><label class="input"><input id="title" name="title" required type="text" value="<?php echo $_SESSION["title"]; ?>" placeholder="Poem title"></label></div>
<div class="col col-md-4">
<div>
<select name="langp" id="langp" class="form-control">
<option value="0" selected disabled>Language</option>
<option value="en" <?php echo $sel_en; ?> ><?php echo $this->xml->lang_en; ?></option>
<option value="fr" <?php echo $sel_fr; ?> ><?php echo $this->xml->lang_fr; ?></option>
<option value="ht" <?php echo $sel_ht; ?> ><?php echo $this->xml->lang_ht; ?></option>
<option value="es"<?php echo $sel_es; ?> ><?php echo $this->xml->lang_es; ?></option>
</select>
</div>
</div>
</div>

<div>
<select class="form-control select2-selection--multiple" multiple name="category[]">
<?php
$sql_q = $this->link->query("SELECT * FROM poem_category  ORDER BY $this->lang ASC") or die(mysql_error());
while ($donnees = $sql_q->fetch(PDO::FETCH_ASSOC)) {
if (in_array($donnees["id"], $category)) {
echo '<option selected value="' . $donnees['id'] . '">' . $donnees[$this->lang] . '</option>';
$groupStr = $groupStr . " > " . $donnees[$this->lang];
} else
echo '<option value="' . $donnees['id'] . '">' . $donnees[$this->lang] . '</option>';
}
?>    
</select>
<span class="fancy-hint size-11 text-muted">
<strong>Hint:</strong> You can select more than one category.
</span>
</div>
<br />
<div><label class="input margin-bottom-10">
<i class="ico-append fa fa-tags"></i>
<input type="text" name="keywords" id="keywords" required placeholder="Poem keywords" value="<?php echo $_SESSION["keywords"]; ?>" />
<span class="fancy-hint size-11 text-muted">
<strong>Hint:</strong> Enter a few keywords separated by comas like: love, joy, peace
</span>
</label></div>

<div class="fancy-form">
<textarea rows="5" class="form-control word-count" id="text" name="text" required data-maxlength="2000" 
          data-info="textarea-words-info" placeholder="Enter your poem here..."><?php echo $_SESSION["text"]; ?></textarea>
<span class="fancy-hint size-11 text-muted">
<strong>Hint:</strong> 2000 words allowed!
<!--span class="pull-right">
<span id="textarea-words-info">0/200</span> Words>
</span-->
</span>
</div>
<br />
<label class="description" for="imail"> 
    <input class="custom-file-upload" type="file" id="image" name="image" data-btn-text="Select a File" placeholder="No file selected"/>
<small class="text-muted block">If you have an image send it. Max file size: 1Mb (jpg/png/gif)</small>
</label> 
</fieldset>
<div class="row margin-bottom-20">
<div class="col-md-10">
<button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> Submit</button>
<button type="reset" class="btn btn-default"><i class="fa fa-clear"></i> Reset</button>
</div>
</div>
</form>
<!-- /add form -->
<?php
}/* END add */

public function randomPoems() {
    $sql_q = $this->link->query("select * FROM $this->poem_table ORDER BY RAND() Limit 5");
    $i = 1;
    while ($row = $sql_q->fetch(PDO::FETCH_ASSOC)) {           
			$data = str_replace(array("&nbsp;", "<br />", "<b>", "</b>", "<font color= red >", "</font>", "\r", "\u", "--", "<br>", ",", "\u00e8s", "'", "\u00e8s", "\u0092"), "", array_map('utf8_encode', $row));
                    array_push($this->response, $data);
        }
        
	   $this->response = json_encode($this->response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            echo utf8_decode($this->response);
}

/* related_poems */
function related() {
    $counter = 0;
    echo '<ul class="list-unstyled list-icons margin-bottom-10">';
    $stmt = $this->link->query("select * FROM $this->poem_table where category like %'$this->poem_categ'% order by views DESC");
    while ($rowr = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $s_id = $rowr["id"];
        $poem_name = $rowr["title"];
        if ($s_id != $this->poemID) {
            $counter++;
            echo '<li class="margin-top-6"><i class="fa fa-angle-right"></i>' . "<a href='./$this->modules.php?$this->module=$s_id'>$poem_name</a></li>";
            if ($counter >= 5) { break; }
        }
    }
    echo "</ul>";
}/* END function related_poems */

/* function showLatest */
function showLatest($limit) {    
    $limit = 5;
    $list = $this->link->query("SELECT * FROM $this->poem_table ORDER BY id DESC limit $limit");
    echo '<ul class="list-unstyled list-icons margin-bottom-10">';
    while ($donnees = $list->fetch(PDO::FETCH_ASSOC)) {
       // echo '<li class="margin-top-6"><i class="fa fa-angle-right"></i><a href="' . $this->modules . '.php?' .$this->module."=" $donnees['id'] . //'">' . $donnees['title'] . '</a> (' . $this->formatTime($donnees['date']) . ')</li>';
	   $data = str_replace(array("&nbsp;", "<br />", "<b>", "</b>", "<font color= red >", "</font>", "\r", "\u", "--", "<br>", ",", "\u00e8s", "'", "\u00e8s", "\u0092"), "", array_map('utf8_encode', $donnees));
       array_push($this->response, $data);
    }
    $this->response = json_encode($this->response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    echo utf8_decode($this->response);
}/*End Function*/

/* showMostViewed */
function showMostViewed($limit) {    
    $list = $this->link->query("SELECT * FROM $this->poem_table ORDER BY views DESC limit $limit");
    echo '<ul class="list-unstyled list-icons margin-bottom-10">';
    while ($donnees = $list->fetch(PDO::FETCH_ASSOC)) {
        $data = str_replace(array("&nbsp;", "<br />", "<b>", "</b>", "<font color= red >", "</font>", "\r", "\u", "--", "<br>", ",", "\u00e8s", "'", "\u00e8s", "\u0092"), "", array_map('utf8_encode', $donnees));
       array_push($this->response, $data);
    }
    $this->response = json_encode($this->response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
echo utf8_decode($this->response);
}

/* End Function showMostViewed */
function showMostCommented($lang, $language) {
    $nombreDeMessagesParPage = 15; 
    $retour = mysql_query('SELECT COUNT(*) AS id FROM $this->poem_table');
    $donnees = mysql_fetch_array($retour);
    $totalDesMessages = $donnees['id'];
    $nombreDePages = ceil($totalDesMessages / $nombreDeMessagesParPage);
    if (isset($_GET['page'])) { $page = $_GET['page']; } else { $page = 1; }
    echo '<p>Page : ';
    echo get_list_page($page, $nombreDePages, "./$this->modules.php?page=$page ", "");
    echo'</p>';
    $premierMessageAafficher = ($page - 1) * $nombreDeMessagesParPage;
    $list = mysql_query('SELECT * FROM $this->poem_table ORDER BY title LIMIT ' . $premierMessageAafficher . ', ' . $nombreDeMessagesParPage);
    $retour1 = mysql_query('SELECT COUNT(*) AS id FROM $this->poem_table');
    $count = mysql_fetch_array($retour1);
    echo $count['id'];
    echo '<ul>';
    while ($donnees = mysql_fetch_array($list)) {
        echo '<li><strong><a href="' . $this->modules . '.php?' .$this->module."=" .$donnees['id'] . '">
' . $donnees['title'] . '</a></strong></li>';
    }
    echo '</ul>';
}
/* End Function showMostCommented */

public function getRandPID() {
    $sql_poem = $this->link->query("select * FROM $this->poem_table ORDER BY RAND() Limit 1");
    while ($row = $sql_poem->fetch(PDO::FETCH_ASSOC)) {
        return $row['id'];
    }
}

/** Returns one of the ID available for a language */
public function setPrevNext_poem($poemID) {
    $sql_poem = $this->link->query("select * FROM $this->poem_table ORDER BY `id` DESC Limit 1");
    while ($row = $sql_poem->fetch(PDO::FETCH_ASSOC)) {
        $this->last_poemID = $row['id'];
    }
    if ($poemID >= $this->last_poemID) {
        $this->next_poem = 1;
    } else {
        $this->next_poem = $poemID + 1;
    }
    if ($poemID <= 1) {
        $this->prev_poem = $this->last_poemID;
    } else {
        $this->prev_poem = $poemID - 1;
    }
}

}
/* The end */
?>