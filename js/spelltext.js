// Full handbook text for each spell, keyed by name
// Rendered as HTML for direct insertion into spell cards

export const SPELL_FULL_TEXT = {

// --- Cantrips -----------------------------------------

'Friends': `
<div class="sft-school">Enchantment Cantrip</div>
<div class="sft-sp-note">Source: Ythryn Magic Goblet</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>10 feet</td></tr>
  <tr><th>Components</th><td>S, M (some makeup)</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 1 minute</td></tr>
</table>
<p>You magically emanate a sense of friendship toward one creature you can see within range. The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration. The target succeeds automatically if it isn't a Humanoid, if you're fighting it, or if you have cast this spell on it within the past 24 hours.</p>
<p>The spell ends early if the target takes damage or if you make an attack roll, deal damage, or force a creature to make a saving throw. When the spell ends, the target knows it was Charmed by you.</p>`,

'Healing Hands': `
<div class="sft-school">Aasimar Species Trait</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>Touch</td></tr>
  <tr><th>Duration</th><td>Instantaneous</td></tr>
</table>
<p>As an action, you touch a creature and roll a number of d4s equal to your Proficiency Bonus. The creature regains a number of Hit Points equal to the total rolled. Once you use this trait, you can't use it again until you finish a Long Rest.</p>`,

'Light': `
<div class="sft-school">Evocation Cantrip</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>Touch</td></tr>
  <tr><th>Components</th><td>V, M (a firefly or phosphorescent moss)</td></tr>
  <tr><th>Duration</th><td>1 hour</td></tr>
</table>
<p>You touch one Large or smaller object that isn't being worn or carried by someone else. Until the spell ends, the object sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet. The light can be colored as you like.</p>
<p>Covering the object with something opaque blocks the light. The spell ends if you cast it again.</p>`,

'Mage Hand': `
<div class="sft-school">Conjuration Cantrip</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>30 feet</td></tr>
  <tr><th>Components</th><td>V, S</td></tr>
  <tr><th>Duration</th><td>1 minute</td></tr>
</table>
<p>A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again.</p>
<p>When you cast the spell, you can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial.</p>
<p>As a Magic action on your later turns, you can control the hand thus again. As part of that action, you can move the hand up to 30 feet. The hand can't attack, activate magic items, or carry more than 10 pounds.</p>`,

'Mending': `
<div class="sft-school">Transmutation Cantrip</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>1 minute</td></tr>
  <tr><th>Range</th><td>Touch</td></tr>
  <tr><th>Components</th><td>V, S, M (two lodestones)</td></tr>
  <tr><th>Duration</th><td>Instantaneous</td></tr>
</table>
<p>This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage.</p>
<p>This spell can physically repair a magic item, but it can't restore magic to such an object.</p>`,

'Mind Sliver': `
<div class="sft-school">Enchantment Cantrip</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>60 feet</td></tr>
  <tr><th>Components</th><td>V</td></tr>
  <tr><th>Duration</th><td>1 round</td></tr>
</table>
<p>You try to temporarily sliver the mind of one creature you can see within range. The target must succeed on an Intelligence saving throw or take 2d6 Psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn.</p>`,

'Minor Illusion': `
<div class="sft-school">Illusion Cantrip</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>30 feet</td></tr>
  <tr><th>Components</th><td>S, M (a bit of fleece)</td></tr>
  <tr><th>Duration</th><td>1 minute</td></tr>
</table>
<p>You create a sound or an image of an object within range that lasts for the duration. See the descriptions below for the effects of each. The illusion ends if you cast this spell again.</p>
<p>If a creature takes a Study action to examine the sound or image, the creature can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to the creature.</p>
<p><strong>Sound.</strong> If you create a sound, its volume can range from a whisper to a scream. It can be your voice, someone else's voice, a lion's roar, a beating of drums, or any other sound you choose. The sound continues unabated throughout the duration, or you can make discrete sounds at different times before the spell ends.</p>
<p><strong>Image.</strong> If you create an image of an object \u2014 such as a chair, muddy footprints, or a small chest \u2014 it must be no larger than a 5-foot Cube. The image can't create sound, light, smell, or any other sensory effect. Physical interaction with the image reveals it to be an illusion, since things can pass through it.</p>`,

'Prestidigitation': `
<div class="sft-school">Transmutation Cantrip</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>10 feet</td></tr>
  <tr><th>Components</th><td>V, S</td></tr>
  <tr><th>Duration</th><td>Up to 1 hour</td></tr>
</table>
<p>You create a magical effect within range. Choose the effect from the options below. If you cast this spell multiple times, you can have up to three of its non-instantaneous effects active at a time.</p>
<p><strong>Sensory Effect.</strong> You create an instantaneous, harmless sensory effect, such as a shower of sparks, a puff of wind, faint musical notes, or an odd odor.</p>
<p><strong>Fire Play.</strong> You instantaneously light or snuff out a candle, a torch, or a small campfire.</p>
<p><strong>Clean or Soil.</strong> You instantaneously clean or soil an object no larger than 1 cubic foot.</p>
<p><strong>Minor Sensation.</strong> You chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour.</p>
<p><strong>Magic Mark.</strong> You make a color, a small mark, or a symbol appear on an object or a surface for 1 hour.</p>
<p><strong>Minor Creation.</strong> You create a nonmagical trinket or an illusory image that can fit in your hand. It lasts until the end of your next turn. A trinket can deal no damage and has no monetary worth.</p>`,

'Sorcerous Burst': `
<div class="sft-school">Evocation Cantrip</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>120 feet</td></tr>
  <tr><th>Components</th><td>V, S</td></tr>
  <tr><th>Duration</th><td>Instantaneous</td></tr>
</table>
<p>You cast sorcerous energy at one creature or object within range. Make a ranged attack roll against the target. On a hit, the target takes 2d8 damage of a type you choose: Acid, Cold, Fire, Lightning, Poison, Psychic, or Thunder.</p>
<p>If you roll an 8 on a d8 for this spell, you can roll another d8, and add it to the damage. When you cast this spell, the maximum number of these d8s you can add to the spell's damage equals your spellcasting ability modifier.</p>`,

// --- 1st Level ----------------------------------------

'Arms of Hadar': `
<div class="sft-school">Level 1 Conjuration</div>
<div class="sft-sp-note">Can cast by expending 1 Sorcery Point without V, S components.</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>Self (10-foot Emanation)</td></tr>
  <tr><th>Components</th><td>V, S</td></tr>
  <tr><th>Duration</th><td>Instantaneous</td></tr>
</table>
<p>Tendrils of dark energy erupt from you. Each creature in a 10-foot Emanation originating from you makes a Strength saving throw. On a failed save, a target takes 2d6 Necrotic damage and can't take Reactions until the start of its next turn. On a successful save, a target takes half as much damage only.</p>
<p class="sft-upcast"><strong>Using a Higher-Level Spell Slot.</strong> The damage increases by 1d6 for each spell slot level above 1.</p>`,

'Chromatic Orb': `
<div class="sft-school">Level 1 Evocation</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>90 feet</td></tr>
  <tr><th>Components</th><td>V, S, M (a chunk of crystal)</td></tr>
  <tr><th>Duration</th><td>Instantaneous</td></tr>
</table>
<p>You hurl an orb of energy at a target within range. Choose Acid, Cold, Fire, Lightning, Poison, or Thunder for the type of orb you create, and then make a ranged spell attack against the target. On a hit, the target takes 3d8 damage of the chosen type.</p>
<p>If you roll the same number on two or more of the d8s, the orb leaps to a different target of your choice within 30 feet of the target. Make an attack roll against the new target and make a new damage roll. The orb can't leap again unless you cast the spell with a level 2+ spell slot.</p>
<p class="sft-upcast"><strong>Using a Higher-Level Spell Slot.</strong> The damage increases by 1d8 for each spell slot level above 1. The orb can leap a maximum number of times equal to the level of the slot expended, and a creature can be targeted only once by each casting of this spell.</p>`,

'Disguise Self': `
<div class="sft-school">Level 1 Illusion</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>Self</td></tr>
  <tr><th>Components</th><td>V, S</td></tr>
  <tr><th>Duration</th><td>1 hour</td></tr>
</table>
<p>You make yourself \u2014 including your clothing, armor, weapons, and other belongings on your person \u2014 look different until the spell ends. You can seem up to 1 foot shorter or taller and can appear heavier or lighter. You must adopt a form that has the same basic arrangement of limbs as you have. Otherwise, the extent of the illusion is up to you.</p>
<p>The changes wrought by this spell fail to hold up to physical inspection. For example, if you use this spell to add a hat to your outfit, objects pass through the hat, and anyone who touches it would feel nothing.</p>
<p>To discern that you are disguised, a creature must take a Study action to inspect your appearance and succeed on an Intelligence (Investigation) check against your spell save DC.</p>`,

'Dissonant Whispers': `
<div class="sft-school">Level 1 Enchantment</div>
<div class="sft-sp-note">Can cast by expending 1 Sorcery Point without V, S components.</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>60 feet</td></tr>
  <tr><th>Components</th><td>V</td></tr>
  <tr><th>Duration</th><td>Instantaneous</td></tr>
</table>
<p>One creature of your choice that you can see within range hears a discordant melody in its mind. The target makes a Wisdom saving throw. On a failed save, it takes 3d6 Psychic damage and must immediately use its Reaction, if available, to move as far away from you as it can, using the safest route. On a successful save, the target takes half as much damage only.</p>
<p class="sft-upcast"><strong>Using a Higher-Level Spell Slot.</strong> The damage increases by 1d6 for each spell slot level above 1.</p>`,

'Feather Fall': `
<div class="sft-school">Level 1 Transmutation</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Reaction, which you take when you or a creature you can see within 60 feet of you falls</td></tr>
  <tr><th>Range</th><td>60 feet</td></tr>
  <tr><th>Components</th><td>V, M (a feather)</td></tr>
  <tr><th>Duration</th><td>1 minute</td></tr>
</table>
<p>Choose up to five falling creatures within range. A falling creature's rate of descent slows to 60 feet per round until the spell ends. If a creature lands before the spell ends, the creature takes no damage from the fall, and the spell ends for that creature.</p>`,

'Invisibility': `
<div class="sft-school">Level 2 Illusion</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>Touch</td></tr>
  <tr><th>Components</th><td>V, S, M (an eyelash in gum arabic)</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 1 hour</td></tr>
</table>
<p>A creature you touch has the Invisible condition until the spell ends. The spell ends early immediately after the target makes an attack roll, deals damage, or casts a spell.</p>
<p class="sft-upcast"><strong>Using a Higher-Level Spell Slot.</strong> You can target one additional creature for each spell slot level above 2.</p>`,

'Mage Armor': `
<div class="sft-school">Level 1 Abjuration</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>Touch</td></tr>
  <tr><th>Components</th><td>V, S, M (a piece of cured leather)</td></tr>
  <tr><th>Duration</th><td>8 hours</td></tr>
</table>
<p>Until the spell ends, the target's base AC becomes 13 plus its Dexterity modifier.</p>`,

'Shield': `
<div class="sft-school">Level 1 Abjuration</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Reaction, which you take when you are hit by an attack roll or targeted by the Magic Missile spell</td></tr>
  <tr><th>Range</th><td>Self</td></tr>
  <tr><th>Components</th><td>V, S</td></tr>
  <tr><th>Duration</th><td>1 round</td></tr>
</table>
<p>An imperceptible barrier of magical force protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from Magic Missile.</p>`,

'Sleep': `
<div class="sft-school">Level 1 Enchantment</div>
<div class="sft-sp-note">Can cast by expending 1 Sorcery Point without V, S components.</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>60 feet</td></tr>
  <tr><th>Components</th><td>V, S, M (a pinch of sand or rose petals)</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 1 minute</td></tr>
</table>
<p>Each creature of your choice in a 5-foot-radius Sphere centered on a point within range must succeed on a Wisdom saving throw or have the Incapacitated condition until the end of its next turn, at which point it must repeat the save. If the target fails the second save, the target has the Unconscious condition for the duration. The spell ends on a target if it takes damage or someone within 5 feet of it takes an action to shake it out of the spell's effect.</p>
<p>Creatures that don't sleep, such as elves, or that have Immunity to the Exhaustion condition automatically succeed on saves against this spell.</p>`,

'Witch Bolt': `
<div class="sft-school">Level 1 Evocation</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>30 feet</td></tr>
  <tr><th>Components</th><td>V, S, M (a twig struck by lightning)</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 1 minute</td></tr>
</table>
<p>A beam of crackling energy lances toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 Lightning damage.</p>
<p>On each of your subsequent turns, you can take a Bonus Action to deal 1d12 Lightning damage to the target automatically. The spell ends if the target is ever outside the spell's range or if it has Total Cover from you.</p>
<p class="sft-upcast"><strong>Using a Higher-Level Spell Slot.</strong> The initial damage increases by 1d12 for each spell slot level above 1.</p>`,

// --- 2nd Level ----------------------------------------

'Calm Emotions': `
<div class="sft-school">Level 2 Abjuration</div>
<div class="sft-sp-note">Can cast by expending 2 Sorcery Points without V, S components.</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>60 feet</td></tr>
  <tr><th>Components</th><td>V, S</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 1 minute</td></tr>
</table>
<p>Each Humanoid in a 20-foot-radius Sphere centered on a point you choose within range must succeed on a Charisma saving throw or be affected by one of the following effects (your choice):</p>
<p>The spell suppresses any effect causing a target to have the Charmed or Frightened condition. When this spell ends, any suppressed effect resumes, provided that its duration has not expired in the meantime.</p>
<p>Alternatively, you make a target Indifferent about creatures of your choice that it is Hostile toward. This indifference ends if the target is attacked or harmed by a spell or if it witnesses any of its allies being harmed. When the spell ends, the creature becomes Hostile again, unless the DM rules otherwise.</p>`,

'Detect Thoughts': `
<div class="sft-school">Level 2 Divination</div>
<div class="sft-sp-note">Can cast by expending 2 Sorcery Points without V, S components.</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>Self</td></tr>
  <tr><th>Components</th><td>V, S, M (a copper piece)</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 1 minute</td></tr>
</table>
<p>You activate one of the effects below. Until the spell ends, you can activate either effect as a Magic action on your later turns.</p>
<p><strong>Sense Thoughts.</strong> You sense the presence of thoughts within 30 feet of yourself that belong to creatures that know languages or are telepathic. You don't read the thoughts, but you know that a thinking creature is present. The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.</p>
<p><strong>Read Thoughts.</strong> Target one creature you can see within 30 feet of yourself or one creature within 30 feet of yourself that you detected with the Sense Thoughts option. You learn what is most on the target's mind right now. If the target doesn't know any languages and isn't telepathic, you learn nothing.</p>
<p>As a Magic action on your next turn, you can try to probe deeper into the target's mind. If you probe deeper, the target makes a Wisdom saving throw. On a failed save, you discern the target's reasoning, emotions, and something that looms large in its mind (such as a worry, love, or hate). On a successful save, the spell ends. Either way, the target knows that you are probing into its mind, and until you shift your attention away from the target's mind, the target can take an action on its turn to make an Intelligence (Arcana) check against your spell save DC, ending the spell on a success.</p>`,

'Mind Whip': `
<div class="sft-school">Level 2 Enchantment</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>90 feet</td></tr>
  <tr><th>Components</th><td>V</td></tr>
  <tr><th>Duration</th><td>1 round</td></tr>
</table>
<p>The target must succeed on an Intelligence saving throw. On a failed save, the target takes 3d6 Psychic damage and can't make Opportunity Attacks until the end of its next turn. On its next turn, it must choose whether it gets a move, an action, or a Bonus Action; it gets only one of the three. On a successful save, the target takes half as much damage only.</p>
<p class="sft-upcast"><strong>Using a Higher-Level Spell Slot.</strong> You can target one additional creature for each spell slot level above 2.</p>`,

"Auril's Binding Ice": `
<div class="sft-school">Level 2 Evocation</div>
<div class="sft-sp-note">Auril's Gift: Free 1/day, or cast with spell slot</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>Self (30-foot cone)</td></tr>
  <tr><th>Components</th><td>S, M (a vial of meltwater)</td></tr>
  <tr><th>Duration</th><td>Instantaneous</td></tr>
</table>
<p>A burst of cold energy emanates from you in a 30-foot cone. Each creature in that area must make a Constitution saving throw. On a failed save, a creature takes 3d8 cold damage and is hindered by ice formations for 1 minute, or until it or another creature within reach of it uses an action to break away the ice. A creature hindered by ice has its speed reduced to 0. On a successful save, a creature takes half as much damage and isn't hindered by ice.</p>
<p class="sft-upcast"><strong>At Higher Levels.</strong> When you cast this spell using a spell slot of 3rd level or higher, increase the cold damage by 1d8 for each slot level above 2nd.</p>`,

'Mirror Image': `
<div class="sft-school">Level 2 Illusion</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>Self</td></tr>
  <tr><th>Components</th><td>V, S</td></tr>
  <tr><th>Duration</th><td>1 minute</td></tr>
</table>
<p>Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, shifting position so it's impossible to track which image is real.</p>
<p>Each time a creature hits you with an attack roll during the spell's duration, roll a d6 for each of your remaining duplicates. If any of the d6s rolls a 3 or higher, one of the duplicates is hit instead of you, and the duplicate is destroyed. The duplicates otherwise ignore all other damage and effects. The spell ends when all three duplicates are destroyed.</p>
<p>A creature is unaffected by this spell if it has the Blinded condition, Blindsight, or Truesight.</p>`,

'Scorching Ray': `
<div class="sft-school">Level 2 Evocation</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>120 feet</td></tr>
  <tr><th>Components</th><td>V, S</td></tr>
  <tr><th>Duration</th><td>Instantaneous</td></tr>
</table>
<p>You hurl three fiery rays. You can hurl them at one target within range or at several. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 Fire damage.</p>
<p class="sft-upcast"><strong>Using a Higher-Level Spell Slot.</strong> You create one additional ray for each spell slot level above 2.</p>`,

'Suggestion': `
<div class="sft-school">Level 2 Enchantment</div>
<div class="sft-sp-note">Can cast by expending 2 Sorcery Points without V, S components.</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>30 feet</td></tr>
  <tr><th>Components</th><td>V, M (a drop of honey)</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 8 hours</td></tr>
</table>
<p>You suggest a course of activity \u2014 described in no more than 25 words \u2014 to one creature you can see within range that can hear and understand you. The suggestion must sound achievable and not involve anything that would obviously deal damage to the target or its allies.</p>
<p>The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration or until you or your allies deal damage to the target. The Charmed target pursues the suggestion to the best of its ability.</p>
<p>The suggested activity can continue for the entire duration, but if the suggested activity can be completed in a shorter time, the spell ends for the target upon completing it.</p>`,

'Web': `
<div class="sft-school">Level 2 Conjuration</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>60 feet</td></tr>
  <tr><th>Components</th><td>V, S, M (a bit of spiderweb)</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 1 hour</td></tr>
</table>
<p>You conjure a mass of sticky webbing at a point within range. The webs fill a 20-foot Cube there for the duration. The webs are Difficult Terrain, and the area within them is Lightly Obscured.</p>
<p>If the webs aren't anchored between two solid masses (such as walls or trees) or layered across a floor, wall, or ceiling, the web collapses on itself, and the spell ends at the start of your next turn. Webs layered over a flat surface have a depth of 5 feet.</p>
<p>The first time a creature enters the webs on a turn or starts its turn there, it must succeed on a Dexterity saving throw or have the Restrained condition while in the webs or until it breaks free.</p>
<p>A creature Restrained by the webs can take an action to make a Strength (Athletics) check against your spell save DC. If it succeeds, it is no longer Restrained.</p>
<p>The webs are flammable. Any 5-foot Cube of webs exposed to fire burns away in 1 round, dealing 2d4 Fire damage to any creature that starts its turn in the fire.</p>`,

// --- 3rd Level ----------------------------------------

'Counterspell': `
<div class="sft-school">Level 3 Abjuration</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Reaction, which you take when you see a creature within 60 feet of yourself casting a spell with Verbal, Somatic, or Material components</td></tr>
  <tr><th>Range</th><td>60 feet</td></tr>
  <tr><th>Components</th><td>S</td></tr>
  <tr><th>Duration</th><td>Instantaneous</td></tr>
</table>
<p>You attempt to interrupt a creature in the process of casting a spell. The creature must make a Constitution saving throw. On a failed save, the spell dissipates with no effect, and the action, Bonus Action, or Reaction used to cast it is wasted. If that spell was cast with a spell slot, the slot isn't expended.</p>`,

'Fireball': `
<div class="sft-school">Level 3 Evocation</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>150 feet</td></tr>
  <tr><th>Components</th><td>V, S, M (a ball of bat guano and sulfur)</td></tr>
  <tr><th>Duration</th><td>Instantaneous</td></tr>
</table>
<p>A bright streak flashes from you to a point you choose within range and then blossoms with a low roar into a fiery explosion. Each creature in a 20-foot-radius Sphere centered on that point makes a Dexterity saving throw, taking 8d6 Fire damage on a failed save or half as much damage on a successful one.</p>
<p>Flammable objects in the area that aren't being worn or carried start burning.</p>
<p class="sft-upcast"><strong>Using a Higher-Level Spell Slot.</strong> The damage increases by 1d6 for each spell slot level above 3.</p>`,

'Sending': `
<div class="sft-school">Level 3 Divination</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>Unlimited</td></tr>
  <tr><th>Components</th><td>V, S, M (a copper wire)</td></tr>
  <tr><th>Duration</th><td>Instantaneous</td></tr>
</table>
<p>You send a short message of 25 words or fewer to a creature you have met or a creature described to you by someone who has met it. The target hears the message in its mind, recognizes you as the sender if it knows you, and can answer in a like manner immediately. The spell enables targets to understand the meaning of your message.</p>
<p>You can send the message across any distance and even to other planes of existence, but if the target is on a different plane than you, there is a 5 percent chance that the message doesn't arrive. You know if the delivery fails.</p>
<p>Upon receiving your message, a creature can block your ability to reach it again with this spell for 8 hours. If you try to send another message during that time, you learn that you are blocked, and the spell fails.</p>`,

'Void of Torment': `
<div class="sft-school">Level 3 Conjuration</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>150 feet</td></tr>
  <tr><th>Components</th><td>V, S, M (a preserved tentacle)</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 1 minute</td></tr>
</table>
<p>You open a gateway to the Far Realm, a region infested with unspeakable horrors. A 20-foot-radius Sphere of Darkness appears, centered on a point with range and lasting for the duration. The Sphere is Difficult Terrain, and it is filled with strange whispers and slurping noises, which can be heard up to 30 feet away. No light, magical or otherwise, can illuminate the area, and creatures fully within it have the Blinded condition.</p>
<p>Any creature that starts its turn in the area takes 2d6 Cold damage. Any creature that ends its turn there must succeed on a Dexterity saving throw or take 2d6 Acid damage from otherworldly tentacles.</p>
<p class="sft-upcast"><strong>Using a Higher-Level Spell Slot.</strong> The Cold or Acid damage (your choice) increases by 1d6 for each spell slot level above 3.</p>`,

// --- 4th Level ----------------------------------------

'Dimension Door': `
<div class="sft-school">Level 4 Conjuration</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>500 feet</td></tr>
  <tr><th>Components</th><td>V</td></tr>
  <tr><th>Duration</th><td>Instantaneous</td></tr>
</table>
<p>You teleport to a location within range. You arrive at exactly the spot desired. It can be a place you can see, one you can visualize, or one you can describe by stating distance and direction, such as "200 feet straight downward" or "300 feet upward to the northwest at a 45-degree angle."</p>
<p>You can also teleport one willing creature. The creature must be within 5 feet of you when you teleport, and it teleports to a space within 5 feet of your destination space.</p>
<p>If you, the other creature, or both would arrive in a space occupied by a creature or completely filled by one or more objects, you and any creature traveling with you each take 4d6 Force damage, and the teleportation fails.</p>`,

'Otherworldly Tentacles': `
<div class="sft-school">Level 4 Conjuration</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>90 feet</td></tr>
  <tr><th>Components</th><td>V, S, M (a tentacle)</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 1 minute</td></tr>
</table>
<p>Squirming, ebony tentacles fill a 20-foot square on ground that you can see within range. For the duration, these tentacles turn the ground in that area into Difficult Terrain.</p>
<p>Each creature in that area makes a Strength saving throw. On a failed save, it takes 3d6 Bludgeoning damage, and it has the Restrained condition until the spell ends. A creature also makes that save if it enters the area or ends its turn there. A creature makes that save only once per turn.</p>
<p>A Restrained creature can take an action to make a Strength (Athletics) check against your spell save DC, ending the condition on itself on a success.</p>`,

'Polymorph': `
<div class="sft-school">Level 4 Transmutation</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>60 feet</td></tr>
  <tr><th>Components</th><td>V, S, M (a caterpillar cocoon)</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 1 hour</td></tr>
</table>
<p>You attempt to transform a creature that you can see within range. The target must succeed on a Wisdom saving throw or shape-shift into Beast form for the duration. That form can be any Beast whose Challenge Rating is equal to or less than the target's level or Challenge Rating. An unwilling target automatically succeeds on the save if it can't be Charmed.</p>
<p>The target's game statistics, including mental ability scores, are replaced by the statistics of the chosen Beast, but the target retains its alignment, personality, creature type, Hit Points, and Hit Point Dice.</p>
<p>The target is limited in the actions it can perform by the anatomy of its new form, and it can't speak or cast spells. The target's gear melds into the new form. The target can't activate, use, wield, or otherwise benefit from any of its equipment.</p>
<p>The target reverts to its normal form when it drops to 0 Hit Points or when the spell ends. If the spell ends normally, the target returns to the number of Hit Points it had before it transformed. If the spell ends from dropping to 0, any excess damage carries over.</p>`,

'Summon Aberration': `
<div class="sft-school">Level 4 Conjuration</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>90 feet</td></tr>
  <tr><th>Components</th><td>V, S, M (a preserved tentacle and an eyeball)</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 1 hour</td></tr>
</table>
<p>You call forth an aberrant spirit. It manifests in an unoccupied space that you can see within range and uses the Aberrant Spirit stat block. When you cast the spell, choose Beholderkin, Mind Flayer, or Slaad. The creature resembles an Aberration of that kind, which determines certain details in its stat block. The creature disappears when it drops to 0 Hit Points or when the spell ends.</p>
<p>The creature is an ally to you and your allies. In combat, it shares your Initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its movement to avoid danger.</p>
<p class="sft-upcast"><strong>Using a Higher-Level Spell Slot.</strong> Use the spell slot's level for the spell's level in the stat block.</p>`,

"Bigby's Hand": `
<div class="sft-school">Level 5 Evocation</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>120 feet</td></tr>
  <tr><th>Components</th><td>V, S, M (eggshell and snakeskin glove)</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 1 minute</td></tr>
</table>
<p>You create a Large hand of shimmering, translucent force in an unoccupied space that you can see within range. The hand lasts for the spell's duration, and it moves at your command, mimicking the movements of your own hand.</p>
<p>The hand is an object that has AC 20 and Hit Points equal to your Hit Point maximum. If it drops to 0 Hit Points, the spell ends. It has a Strength of 26 (+8) and a Dexterity of 10 (+0). The hand doesn't fill its space.</p>
<p>When you cast the spell and as a Bonus Action on your subsequent turns, you can move the hand up to 60 feet and then cause one of the following effects with it:</p>
<p><strong>Clenched Fist.</strong> The hand strikes one creature or object within 5 feet of it. Make a melee spell attack for the hand using your game statistics. On a hit, the target takes 4d8 Force damage.</p>
<p><strong>Forceful Hand.</strong> The hand attempts to push a creature within 5 feet of it in a direction you choose. Make a check with the hand's Strength contested by the Strength (Athletics) check of the target. If the target is Medium or smaller, you have Advantage on the check. If you succeed, the hand pushes the target up to 5 feet plus a number of feet equal to five times your spellcasting ability modifier. The hand moves with the target to remain within 5 feet of it.</p>
<p><strong>Grasping Hand.</strong> The hand attempts to grapple a Huge or smaller creature within 5 feet of it. You use the hand's Strength score to resolve the grapple. If the target is Medium or smaller, you have Advantage on the check. While the hand is grappling the target, you can use a Bonus Action to have the hand crush it, dealing 2d6 + your spellcasting ability modifier Bludgeoning damage.</p>
<p><strong>Interposing Hand.</strong> The hand interposes itself between you and a creature you choose until you give the hand a different command. The hand moves to stay between you and the target, providing you with Half Cover. The target can't move through the hand's space if its Strength score is less than or equal to the hand's Strength score. If its Strength score is higher, the target can move toward you through the hand's space, but that space is Difficult Terrain for the target.</p>
<p class="sft-upcast"><strong>Using a Higher-Level Spell Slot.</strong> The damage of the Clenched Fist increases by 2d8 and the damage of the Grasping Hand increases by 2d6 for each spell slot level above 5.</p>`,


// --- 3rd Level (added) -----------------------------------

'Fear': `
<div class="sft-school">3rd-level Illusion</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>Self (30-foot cone)</td></tr>
  <tr><th>Components</th><td>V, S, M (a white feather or the heart of a hen)</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 1 minute</td></tr>
</table>
<p>You project a phantasmal image of a creature's worst fears. Each creature in a 30-foot cone must succeed on a Wisdom saving throw or drop whatever it is holding and become Frightened for the duration.</p>
<p>While Frightened by this spell, a creature must take the Dash action and move away from you by the safest available route on each of its turns, unless there is nowhere to move. If the creature ends its turn in a location where it doesn't have line of sight to you, the creature can make a Wisdom saving throw. On a successful save, the spell ends for that creature.</p>`,

'Haste': `
<div class="sft-school">3rd-level Transmutation</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>30 feet</td></tr>
  <tr><th>Components</th><td>V, S, M (a shaving of licorice root)</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 1 minute</td></tr>
</table>
<p>Choose a willing creature that you can see within range. Until the spell ends, the target's Speed is doubled, it gains a +2 bonus to Armor Class, it has Advantage on Dexterity saving throws, and it gains an additional action on each of its turns. That action can be used to take only the Attack (one attack only), Dash, Disengage, Hide, or Utilize action.</p>
<p>When the spell ends, the target is Incapacitated and has a Speed of 0 until the end of its next turn, as a wave of lethargy washes over it.</p>`,

// --- 4th Level (added) -----------------------------------

'Backlash': `
<div class="sft-school">4th-level Abjuration</div>
<div class="sft-sp-note">Source: Forgotten Realms \u2014 Heroes of Faer\u00fbn</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Reaction (taking damage)</td></tr>
  <tr><th>Range</th><td>60 feet</td></tr>
  <tr><th>Components</th><td>V</td></tr>
  <tr><th>Duration</th><td>Instantaneous</td></tr>
</table>
<p>You ward yourself against destructive energy, reducing the damage taken by 4d6 plus your spellcasting ability modifier.</p>
<p>If the triggering damage was from a creature within range, you can force the creature to make a Constitution saving throw. The creature takes 4d6 Force damage on a failed save or half as much damage on a successful one.</p>
<p class="sft-upcast"><strong>Using a Higher-Level Spell Slot.</strong> The damage reduction and Force damage from this spell both increase by 1d6 for every spell slot level above 4.</p>`,

// --- 5th Level (added) -----------------------------------

'Telekinesis': `
<div class="sft-school">5th-level Transmutation</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>60 feet</td></tr>
  <tr><th>Components</th><td>V, S</td></tr>
  <tr><th>Duration</th><td>Concentration, up to 10 minutes</td></tr>
</table>
<p>You gain the ability to move or manipulate creatures or objects by thought. When you cast the spell, and as a Magic action on each of your turns thereafter, you can exert your will on one creature or object that you can see within range, causing the appropriate effect below.</p>
<p><strong>Creature.</strong> You can try to move a Huge or smaller creature. Make an ability check with your spellcasting ability contested by the creature's Strength check. If you win the contest, you move the creature up to 30 feet in any direction, including upward but not beyond the range of this spell. Until the end of your next turn, the creature is Restrained in your telekinetic grip. A creature lifted upward is suspended in mid-air. On subsequent rounds, you can use your action to attempt to maintain your telekinetic grip on the creature by repeating the contest.</p>
<p><strong>Object.</strong> You can try to move an object that weighs up to 1,000 pounds. If the object isn't being worn or carried, you automatically move it up to 30 feet in any direction, but not beyond the range of this spell. If the object is worn or carried by a creature, you must make an ability check with your spellcasting ability contested by that creature's Strength check. If you succeed, you pull the object away from that creature and can move it up to 30 feet in any direction but not beyond the range of this spell. You can exert fine control on objects with your telekinetic grip, such as manipulating a simple tool, opening a door or a container, stowing or retrieving an item from an open container, or pouring the contents from a vial.</p>`,

'Telepathic Bond': `
<div class="sft-school">5th-level Divination (Ritual)</div>
<table class="sft-stats">
  <tr><th>Casting Time</th><td>Action</td></tr>
  <tr><th>Range</th><td>30 feet</td></tr>
  <tr><th>Components</th><td>V, S, M (pieces of eggshell from two different kinds of creatures)</td></tr>
  <tr><th>Duration</th><td>1 hour</td></tr>
</table>
<p>You forge a telepathic link among up to eight willing creatures of your choice within range, psychically linking each creature to all the others for the duration. Creatures with Intelligence scores of 2 or less aren't affected by this spell.</p>
<p>Until the spell ends, the targets can communicate telepathically through the bond whether or not they have a common language. The communication is possible over any distance, though it can't extend to other planes of existence.</p>`,

};
