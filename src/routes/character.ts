import { isHugeEnemy } from "../function/EnemyHelper";
import express from "express";
const router = express.Router();
const character_table: any = require ("../database/character_table.json");
const skill_table: any = require ("../database/skill_table.json");
const uniequip_table: any = require ("../database/uniequip_table.json");
const battle_equip_table: any = require ("../database/battle_equip_table.json");

interface CharacterRef{
  key: string, //請求的角色Id
  //phasesLevel: number, //請求的角色精英階級 (0 = 精零、1 = 精一、2 = 精二)
  //skillId: string, //請求的角色技能Id
}

interface CharacterData{
  key: string, //角色id -> character_table.key

  name: string, //角色名稱 -> character_table[key].name

  sortIndex: number, //角色排序 -> character_table[key].sortIndex

  rarity: string, //角色星級 -> character_table[key].rarity 
  //(TIER_1、TIER_2、TIER_3、TIER_4、TIER_5、TIER_6)

  profession: string, //角色職業 -> character_table[key].profession
  //(PIONEER = 先鋒、WARRIOR = 近衛、SNIPER = 狙擊、TANK = 重裝、MEDIC = 醫療、SUPPORT = 輔助、CASTER = 術師、SPECIAL = 特種)

  subProfessionId: string, //角色分支 -> character_table[key].subProfessionId
  //(分支較多，不再此一一舉例，詳細可參考 /src/database/subProfessionId.json)

  phases: any[], //角色各精英階級資訊 -> character_table[key].phases[index]
  //(phases[0] = 精零、phases[1] = 精一、phases[2] = 精二)

  //attributesKeyFrames: any[], //角色某精英階級的1級和滿級資訊 -> character_table[key].phases[index].attributesKeyFrames[index]
  //(phases[1].attributesKeyFrames[0] = 精一1級、phases[1].attributesKeyFrames[1] = 精一滿級)

  //data: object, //角色基礎數值資訊 -> character_table[key].phases[index].attributesKeyFrames[index].data
  //(data.cost = 部屬費用、data.respawnTime = 再部屬時間、data.spRecoveryPerSec = 技力回復速度)

  skills: any[], //角色各技能資訊 -> character_table[key].skills[index]
  //(skills[].skillId = 技能id)

  talents: any[], //角色各天賦資訊 -> character_table[key].talents[index]

  //candidates: any[], //角色天賦各階段 -> character_table[key].talents[index].candidates[index]

  //unlockCondition: object, //角色天賦階段解鎖條件 -> character_table[key].talents[index].candidates[index].unlockCondition
  //(unlockCondition.phase = PHASE_0、unlockCondition.level = 1 (精零1級解鎖))

  //blackboard: any[], //角色天賦實際屬性資訊 -> character_table[key].talents[index].candidates[index].blackboard[index]
  //(blackboard[].key = 屬性key名、blackboard[].value = 屬性實際數值)

  potentialRanks: any[], //角色潛能資訊 -> character_table[key].potentialRanks[index]

  //attributeModifiers: any[], //角色各潛能實際屬性資訊 -> character_table[key].potentialRanks[index].buff.attributes.attributeModifiers[index]
  //(attributeModifiers[].attributeType = "COST" (費用潛能)、attributeModifiers[].value = -1.0 (-1費用))
  //(attributeModifiers[].attributeType = "RESPAWN_TIME" (再部屬潛能)、attributeModifiers[].value = -6.0 (-6秒再部屬時間))
}

const getCharacterData  = ( characterRef:CharacterRef[] ): CharacterData[] => {
  const characterDatas: CharacterData[] = [];

  characterRef.forEach((characterRef: CharacterRef) => {
    const character = character_table[characterRef.key]
    
    const parsedData: CharacterData= {
      key: characterRef.key,
      name: character.name,  
      sortIndex: character.sortIndex, 
      rarity: character.rarity,
      profession: character.profession,
      subProfessionId: character.subProfessionId,
      phases: character.phases,
      skills: character.skills,
      talents: character.talents,
      potentialRanks: character.potentialRanks,

    }

    characterDatas.push(parsedData);
  })

  return characterDatas;
}

router.post("/id", (req: any, res: any) => {
  const CharacterIDs: string[] = Object.keys(character_table);
  res.send({
    data: { CharacterIDs: CharacterIDs }
  })
})
router.post("/data", (req: any, res: any) => {
  const CharacterRefs: CharacterRef[] = req.body?.characterRefs;
  const CharacterDatas: CharacterData[] = getCharacterData(CharacterRefs);
  res.send({
    data: { CharacterDatas: CharacterDatas }
  })
})

export default router;
