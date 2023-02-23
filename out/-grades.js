const data = [
  //If you know how arrays work you can change the sequence here
  //btw, you can use \n and it'll newline in the language webview

  /* 001 */ "G-", 
  /* 002 */ "G", 
  /* 003 */ "G+",
  /* 004 */ "F-", 
  /* 005 */ "F", 
  /* 006 */ "F+",
  /* 007 */ "E-", 
  /* 008 */ "E", 
  /* 009 */ "E+",
  /* 010 */ "D-", 
  /* 011 */ "D", 
  /* 012 */ "D+",
  /* 013 */ "C-", 
  /* 014 */ "C", 
  /* 015 */ "C+",
  /* 016 */ "B-", 
  /* 017 */ "B", 
  /* 018 */ "B+",
  /* 019 */ "A-", 
  /* 020 */ "A", 
  /* 021 */ "A+",
  /* 022 */ "S-", 
  /* 023 */ "S", 
  /* 024 */ "S+",
  /* 025 */ "SS-", 
  /* 026 */ "SS", 
  /* 027 */ "SS+",
  /* 028 */ "SSS-", 
  /* 029 */ "SSS", 
  /* 030 */ "SSS+",
  /* 031 */ "\u{22C6}", 
  /* 032 */ "\u{2606}", 
  /* 033 */ "\u{2605}",
  /* 034 */ "\u{2605}\u{22C6}", 
  /* 035 */ "\u{2605}\u{2606}", 
  /* 036 */ "\u{2605}\u{2605}",
  /* 037 */ "\u{2605}\u{2605}\u{22C6}", 
  /* 038 */ "\u{2605}\u{2605}\u{2606}", 
  /* 039 */ "\u{2605}\u{2605}\u{2605}",
  /* 040 */ "\u{2605}\u{2605}\u{2605}\u{22C6}", 
  /* 041 */ "\u{2605}\u{2605}\u{2605}\u{2606}", 
  /* 042 */ "\u{2605}\u{2605}\u{2605}\u{2605}",
  /* 043 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{22C6}", 
  /* 044 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2606}", 
  /* 045 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}",
  /* 046 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{22C6}",
  /* 047 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2606}",
  /* 048 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}",
  /* 049 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{22C6}",
  /* 050 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2606}",
  /* 051 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}",
  /* 052 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\n\u{22C6}",
  /* 053 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\n\u{2606}",
  /* 054 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\n\u{2605}",
  /* 055 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\n\u{2605}\u{22C6}",
  /* 056 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\n\u{2605}\u{2606}",
  /* 057 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\n\u{2605}\u{2605}",
  /* 058 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\n\u{2605}\u{2605}\u{22C6}",
  /* 059 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\n\u{2605}\u{2605}\u{2606}",
  /* 060 */ "\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\u{2605}\n\u{2605}\u{2605}\u{2605}",
  /* 061 */ "10\u{2605} \u{22C6}",
  /* 062 */ "10\u{2605} \u{2606}",
  /* 063 */ "11\u{2605}",
  /* 064 */ "11\u{2605} \u{22C6}",
  /* 065 */ "11\u{2605} \u{2606}",
  /* 066 */ "12\u{2605}",
  /* 067 */ "12\u{2605} \u{22C6}",
  /* 068 */ "12\u{2605} \u{2606}",
  /* 069 */ "13\u{2605}",
  /* 070 */ "13\u{2605} \u{22C6}",
  /* 071 */ "13\u{2605} \u{2606}",
  /* 072 */ "14\u{2605}",
  /* 073 */ "14\u{2605} \u{22C6}",
  /* 074 */ "14\u{2605} \u{2606}",
  /* 075 */ "15\u{2605}",
  /* 076 */ "15\u{2605} \u{22C6}",
  /* 077 */ "15\u{2605} \u{2606}",
  /* 078 */ "16\u{2605}",
  /* 079 */ "16\u{2605} \u{22C6}",
  /* 080 */ "16\u{2605} \u{2606}",
  /* 081 */ "17\u{2605}",
  /* 082 */ "17\u{2605} \u{22C6}",
  /* 083 */ "17\u{2605} \u{2606}",
  /* 084 */ "18\u{2605}",
  /* 085 */ "18\u{2605} \u{22C6}",
  /* 086 */ "18\u{2605} \u{2606}",
  /* 087 */ "19\u{2605}",
  /* 088 */ "19\u{2605} \u{22C6}",
  /* 089 */ "19\u{2605} \u{2606}",
  /* 090 */ "20\u{2605}",
  /* 091 */ "20\u{2605} \u{22C6}",
  /* 092 */ "20\u{2605} \u{2606}",
  /* 093 */ "21\u{2605}",
  /* 094 */ "21\u{2605} \u{22C6}",
  /* 095 */ "21\u{2605} \u{2606}",
  /* 096 */ "22\u{2605}",
  /* 097 */ "22\u{2605} \u{22C6}",
  /* 098 */ "22\u{2605} \u{2606}",
  /* 099 */ "23\u{2605}",
  /* 100 */ "23\u{2605} \u{22C6}",
  /* 101 */ "23\u{2605} \u{2606}",
  /* 102 */ "24\u{2605}",
  /* 103 */ "24\u{2605} \u{22C6}",
  /* 104 */ "24\u{2605} \u{2606}",
  /* 105 */ "25\u{2605}",
  /* 106 */ "25\u{2605} \u{22C6}",
  /* 107 */ "25\u{2605} \u{2606}",
  /* 108 */ "26\u{2605}",
  /* 109 */ "26\u{2605} \u{22C6}",
  /* 110 */ "26\u{2605} \u{2606}",
  /* 111 */ "27\u{2605}",
  /* 112 */ "27\u{2605} \u{22C6}",
  /* 113 */ "27\u{2605} \u{2606}",
  /* 114 */ "28\u{2605}",
  /* 115 */ "28\u{2605} \u{22C6}",
  /* 116 */ "28\u{2605} \u{2606}",
  /* 117 */ "29\u{2605}",
  /* 118 */ "29\u{2605} \u{22C6}",
  /* 119 */ "29\u{2605} \u{2606}",
  /* 120 */ "30\u{2605}",
]

module.exports = {
  data
}