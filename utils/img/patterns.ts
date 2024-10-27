/*
Unfortunately, ATS sprite sheets have a lot of duplication, and there isn't an obvious way to de-duplicate these.

We'll need to strip the following out
(no reward) - Ruined buildings have an equivalent (no reward) sprite
Haunted - always the same as the non-haunted version
 {number} - for goods, if they end with a count, they are always the same as the non-count version
[Altar] - cornerstones that start w/ altar are always the same as the non-altar version

*/

const patterns: RegExp[] = 
[
    /\(no reward\)/i,
    /Haunted/i,
    /\s\d+$/,
     /^\[Altar\]/i
];

export { patterns };