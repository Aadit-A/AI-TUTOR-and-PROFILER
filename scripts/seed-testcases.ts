/**
 * Seeds test cases from data/testcases.json + C++ drivers into MongoDB.
 * Run: npm run seed:testcases
 */
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
dotenv.config({ path: '.env.local' });

// ─── Parse multi-array JSON file ───────────────────────
function loadFile(fp: string): any[] {
  const raw = fs.readFileSync(fp, 'utf-8');
  const all: any[] = [];
  let d = 0, s = -1;
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === '[') { if (d === 0) s = i; d++; }
    if (raw[i] === ']') { d--; if (d === 0 && s >= 0) {
      try { all.push(...JSON.parse(raw.slice(s, i + 1))); } catch {} s = -1;
    }}
  }
  return all;
}

// ─── Format expected output to stdout string ───────────
const fa = (a: any[]): string => {
  if (!a?.length) return '[]';
  return Array.isArray(a[0]) ? '[' + a.map(fa).join(',') + ']' : '[' + a.join(',') + ']';
};
function fmtE(e: any): string | null {
  if (typeof e === 'boolean') return e ? 'true' : 'false';
  if (typeof e === 'number') return Number.isInteger(e) ? '' + e : e.toFixed(5);
  if (typeof e === 'string') return /\d+_|_\w+|_text|_board|_tree|_sudoku|_ips|_subsets|_permut|_combin|_spiral|_gray|_anagram|_solved|_correct|_justified|_rotated/.test(e) ? null : e;
  if (Array.isArray(e)) return fa(e);
  return null;
}

// ─── Convert input object to stdin string ──────────────
const vi = (a: any[]) => a?.length ? a.length + '\n' + a.join(' ') : '0';
const tr = (a: any[]) => !a?.length ? '0' : a.length + '\n' + a.map((v: any) => v === null ? -1001 : v).join(' ');

type CF = (i: any) => string | null;
const CONV: Record<number, CF> = {
  1:  i => vi(i.nums) + '\n' + i.target,
  2:  i => vi(i.l1) + '\n' + vi(i.l2),
  3:  i => i.s ?? '',
  4:  i => vi(i.nums1) + '\n' + vi(i.nums2),
  5:  i => i.s ?? '',
  6:  i => i.s + '\n' + i.numRows,
  7:  i => '' + i.x,
  8:  i => i.s ?? '',
  9:  i => '' + i.x,
  10: i => i.s + '\n' + i.p,
  11: i => vi(i.height),
  12: i => '' + i.num,
  13: i => i.s,
  14: i => i.strs.length + '\n' + i.strs.join('\n'),
  15: i => vi(i.nums),
  16: i => vi(i.nums) + '\n' + i.target,
  17: i => i.digits ?? '',
  18: i => vi(i.nums) + '\n' + i.target,
  19: i => vi(i.head) + '\n' + i.n,
  20: i => i.s ?? '',
  21: i => vi(i.list1) + '\n' + vi(i.list2),
  22: i => '' + i.n,
  23: i => { const ls = i.lists; if (!ls?.length) return '0'; return ls.length + '\n' + ls.map((l: any) => vi(l)).join('\n'); },
  24: i => vi(i.head),
  25: i => vi(i.head) + '\n' + i.k,
  26: i => vi(i.nums),
  27: i => vi(i.nums) + '\n' + i.val,
  28: i => i.haystack + '\n' + i.needle,
  29: i => i.dividend + ' ' + i.divisor,
  30: i => i.s + '\n' + i.words.length + '\n' + i.words.join('\n'),
  31: i => vi(i.nums),
  32: i => i.s ?? '',
  33: i => vi(i.nums) + '\n' + i.target,
  34: i => vi(i.nums) + '\n' + i.target,
  35: i => vi(i.nums) + '\n' + i.target,
  38: i => '' + i.n,
  39: i => vi(i.candidates) + '\n' + i.target,
  40: i => vi(i.candidates) + '\n' + i.target,
  41: i => vi(i.nums),
  42: i => vi(i.height),
  43: i => i.num1 + ' ' + i.num2,
  44: i => i.s + '\n' + i.p,
  45: i => vi(i.nums),
  46: i => vi(i.nums),
  47: i => vi(i.nums),
  48: i => { const m = i.matrix; return m.length + '\n' + m.flat().join(' '); },
  49: i => i.strs.length + '\n' + i.strs.join('\n'),
  50: i => i.x + ' ' + i.n,
  51: i => '' + i.n,
  52: i => '' + i.n,
  53: i => vi(i.nums),
  54: i => { const m = i.matrix; if (!m?.length) return '0 0'; return m.length + ' ' + m[0].length + '\n' + m.flat().join(' '); },
  55: i => vi(i.nums),
  56: i => { const v = i.intervals; if (!v?.length) return '0'; return v.length + '\n' + v.map((p: any) => p[0] + ' ' + p[1]).join('\n'); },
  57: i => { const v = i.intervals; const ni = i.newInterval; return (v?.length || 0) + '\n' + (v || []).map((p: any) => p[0] + ' ' + p[1]).join('\n') + '\n' + ni[0] + ' ' + ni[1]; },
  58: i => i.s ?? '',
  59: i => '' + i.n,
  60: i => i.n + ' ' + i.k,
  61: i => vi(i.head) + '\n' + i.k,
  62: i => i.m + ' ' + i.n,
  63: i => { const g = i.grid; return g.length + ' ' + g[0].length + '\n' + g.flat().join(' '); },
  64: i => { const g = i.grid; return g.length + ' ' + g[0].length + '\n' + g.flat().join(' '); },
  65: i => i.s ?? '',
  66: i => vi(i.digits),
  67: i => i.a + ' ' + i.b,
  69: i => '' + i.x,
  70: i => '' + i.n,
  71: i => i.path ?? '',
  72: i => i.word1 + ' ' + i.word2,
  73: i => { const m = i.matrix; return m.length + ' ' + m[0].length + '\n' + m.flat().join(' '); },
  74: i => { const m = i.matrix; if (!m?.length) return '0 0\n0'; return m.length + ' ' + m[0].length + '\n' + m.flat().join(' ') + '\n' + i.target; },
  75: i => vi(i.nums),
  76: i => i.s + ' ' + i.t,
  77: i => i.n + ' ' + i.k,
  78: i => vi(i.nums),
  79: i => { const b = i.board; return b.length + ' ' + b[0].length + '\n' + b.map((r: any) => r.join('')).join('\n') + '\n' + i.word; },
  80: i => vi(i.nums),
  81: i => vi(i.nums) + '\n' + i.target,
  82: i => vi(i.head),
  83: i => vi(i.head),
  84: i => vi(i.heights),
  85: i => { const m = i.matrix; if (!m?.length) return '0 0'; return m.length + ' ' + m[0].length + '\n' + m.map((r: any) => r.join('')).join('\n'); },
  86: i => vi(i.head) + '\n' + i.x,
  87: i => i.s1 + ' ' + i.s2,
  88: i => i.m + ' ' + i.n + '\n' + i.nums1.slice(0, i.m).join(' ') + '\n' + i.nums2.join(' '),
  89: i => '' + i.n,
  90: i => vi(i.nums),
  91: i => i.s ?? '',
  92: i => vi(i.head) + '\n' + i.left + ' ' + i.right,
  93: i => i.s ?? '',
  94: i => tr(i.root),
  96: i => '' + i.n,
  97: i => i.s1 + ' ' + i.s2 + ' ' + i.s3,
  98: i => tr(i.root),
  100: i => tr(i.p) + '\n' + tr(i.q),
};

// ─── C++ Driver Code ──────────────────────────────────
const LL = `ListNode*B(vector<int>&v){ListNode d(0);ListNode*p=&d;for(int x:v){p->next=new ListNode(x);p=p->next;}return d.next;}
void P(ListNode*h){cout<<"[";while(h){cout<<h->val;h=h->next;if(h)cout<<",";}cout<<"]"<<endl;}`;

const TR = `TreeNode*BT(vector<int>&v){if(v.empty()||v[0]==-1001)return nullptr;TreeNode*r=new TreeNode(v[0]);queue<TreeNode*>q;q.push(r);int i=1;while(i<(int)v.size()){auto*c=q.front();q.pop();if(i<(int)v.size()&&v[i]!=-1001){c->left=new TreeNode(v[i]);q.push(c->left);}i++;if(i<(int)v.size()&&v[i]!=-1001){c->right=new TreeNode(v[i]);q.push(c->right);}i++;}return r;}`;

const dViT_Vi = (fn: string) => `int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;int t;cin>>t;Solution s;auto r=s.${fn}(v,t);sort(r.begin(),r.end());cout<<"[";for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"]"<<endl;}}`;
const dVi_Int = (fn: string) => `int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;Solution s;cout<<s.${fn}(v)<<endl;}}`;
const dVi_Bool = (fn: string) => `int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;Solution s;cout<<(s.${fn}(v)?"true":"false")<<endl;}}`;
const dVi_Vi = (fn: string) => `int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;Solution s;auto r=s.${fn}(v);cout<<"[";for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"]"<<endl;}}`;
const dViVoid = (fn: string) => `int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;Solution s;s.${fn}(v);cout<<"[";for(int i=0;i<n;i++){if(i)cout<<",";cout<<v[i];}cout<<"]"<<endl;}}`;
const dViT_Int = (fn: string) => `int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;int t;cin>>t;Solution s;cout<<s.${fn}(v,t)<<endl;}}`;
const dS_Int = (fn: string) => `int main(){int T;cin>>T;while(T--){string s;cin>>s;Solution sol;cout<<sol.${fn}(s)<<endl;}}`;
const dSl_Int = (fn: string) => `int main(){int T;cin>>T;cin.ignore();while(T--){string s;getline(cin,s);Solution sol;cout<<sol.${fn}(s)<<endl;}}`;
const dSl_Str = (fn: string) => `int main(){int T;cin>>T;cin.ignore();while(T--){string s;getline(cin,s);Solution sol;cout<<sol.${fn}(s)<<endl;}}`;
const dI_Int = (fn: string) => `int main(){int T;cin>>T;while(T--){int n;cin>>n;Solution s;cout<<s.${fn}(n)<<endl;}}`;
const dI_Bool = (fn: string) => `int main(){int T;cin>>T;while(T--){int n;cin>>n;Solution s;cout<<(s.${fn}(n)?"true":"false")<<endl;}}`;
const dI_Str = (fn: string) => `int main(){int T;cin>>T;while(T--){int n;cin>>n;Solution s;cout<<s.${fn}(n)<<endl;}}`;
const d2I_Int = (fn: string) => `int main(){int T;cin>>T;while(T--){int a,b;cin>>a>>b;Solution s;cout<<s.${fn}(a,b)<<endl;}}`;
const dS_Bool = (fn: string) => `int main(){int T;cin>>T;while(T--){string s;cin>>s;Solution sol;cout<<(sol.${fn}(s)?"true":"false")<<endl;}}`;
const d2S_Str = (fn: string) => `int main(){int T;cin>>T;while(T--){string a,b;cin>>a>>b;Solution s;cout<<s.${fn}(a,b)<<endl;}}`;
const d2S_Int = (fn: string) => `int main(){int T;cin>>T;while(T--){string a,b;cin>>a>>b;Solution s;cout<<s.${fn}(a,b)<<endl;}}`;
const d2S_Bool = (fn: string) => `int main(){int T;cin>>T;while(T--){string a,b;cin>>a>>b;Solution s;cout<<(s.${fn}(a,b)?"true":"false")<<endl;}}`;
const dLL2 = (fn: string) => LL + `\nint main(){int T;cin>>T;while(T--){int n1;cin>>n1;vector<int>a(n1);for(auto&x:a)cin>>x;int n2;cin>>n2;vector<int>b(n2);for(auto&x:b)cin>>x;Solution s;P(s.${fn}(B(a),B(b)));}}`;
const dLL = (fn: string) => LL + `\nint main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;Solution s;P(s.${fn}(B(a)));}}`;
const dLLk = (fn: string) => LL + `\nint main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;int k;cin>>k;Solution s;P(s.${fn}(B(a),k));}}`;
const dTree_Vi = (fn: string) => TR + `\nint main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;Solution s;auto r=s.${fn}(BT(v));cout<<"[";for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"]"<<endl;}}`;
const dTree_Bool = (fn: string) => TR + `\nint main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;Solution s;cout<<(s.${fn}(BT(v))?"true":"false")<<endl;}}`;
const d2Tree_Bool = (fn: string) => TR + `\nint main(){int T;cin>>T;while(T--){int n1;cin>>n1;vector<int>a(n1);for(auto&x:a)cin>>x;int n2;cin>>n2;vector<int>b(n2);for(auto&x:b)cin>>x;Solution s;cout<<(s.${fn}(BT(a),BT(b))?"true":"false")<<endl;}}`;
const dViT_VVi = (fn: string) => `int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;int t;cin>>t;Solution s;auto r=s.${fn}(v,t);cout<<"[";for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<"[";for(int j=0;j<(int)r[i].size();j++){if(j)cout<<",";cout<<r[i][j];}cout<<"]";}cout<<"]"<<endl;}}`;
const dVi_VVi = (fn: string) => `int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;Solution s;auto r=s.${fn}(v);cout<<"[";for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<"[";for(int j=0;j<(int)r[i].size();j++){if(j)cout<<",";cout<<r[i][j];}cout<<"]";}cout<<"]"<<endl;}}`;
const dVi_Cnt = (fn: string) => `int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;Solution s;cout<<(int)s.${fn}(v).size()<<endl;}}`;

// ─── Per-problem: [driver, compareMode] ────────────────
const DRIVERS: Record<number, [string, string]> = {
  1:  [dViT_Vi('twoSum'), 'sorted'],
  2:  [dLL2('addTwoNumbers'), 'exact'],
  3:  [dS_Int('lengthOfLongestSubstring'), 'exact'],
  4:  [`int main(){int T;cin>>T;while(T--){int n1;cin>>n1;vector<int>a(n1);for(auto&x:a)cin>>x;int n2;cin>>n2;vector<int>b(n2);for(auto&x:b)cin>>x;Solution s;cout<<fixed<<setprecision(5)<<s.findMedianSortedArrays(a,b)<<endl;}}`, 'float'],
  5:  [dSl_Str('longestPalindrome'), 'any_valid'],
  6:  [`int main(){int T;cin>>T;cin.ignore();while(T--){string s;getline(cin,s);int r;cin>>r;cin.ignore();Solution sol;cout<<sol.convert(s,r)<<endl;}}`, 'exact'],
  7:  [dI_Int('reverse'), 'exact'],
  8:  [dSl_Str('myAtoi'), 'exact'],
  9:  [dI_Bool('isPalindrome'), 'exact'],
  10: [`int main(){int T;cin>>T;cin.ignore();while(T--){string s,p;getline(cin,s);getline(cin,p);Solution sol;cout<<(sol.isMatch(s,p)?"true":"false")<<endl;}}`, 'exact'],
  11: [dVi_Int('maxArea'), 'exact'],
  12: [dI_Str('intToRoman'), 'exact'],
  13: [`int main(){int T;cin>>T;while(T--){string s;cin>>s;Solution sol;cout<<sol.romanToInt(s)<<endl;}}`, 'exact'],
  14: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;cin.ignore();vector<string>v(n);for(int i=0;i<n;i++)getline(cin,v[i]);Solution s;cout<<s.longestCommonPrefix(v)<<endl;}}`, 'exact'],
  15: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;Solution s;auto r=s.threeSum(v);cout<<"[";for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<"[";for(int j=0;j<(int)r[i].size();j++){if(j)cout<<",";cout<<r[i][j];}cout<<"]";}cout<<"]"<<endl;}}`, 'unordered'],
  16: [dViT_Int('threeSumClosest'), 'exact'],
  17: [`int main(){int T;cin>>T;while(T--){string s;cin>>s;Solution sol;auto r=sol.letterCombinations(s);cout<<"[";for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"]"<<endl;}}`, 'unordered'],
  18: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;int t;cin>>t;Solution s;auto r=s.fourSum(v,t);cout<<"[";for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<"[";for(int j=0;j<(int)r[i].size();j++){if(j)cout<<",";cout<<r[i][j];}cout<<"]";}cout<<"]"<<endl;}}`, 'unordered'],
  19: [dLLk('removeNthFromEnd'), 'exact'],
  20: [dS_Bool('isValid'), 'exact'],
  21: [dLL2('mergeTwoLists'), 'exact'],
  22: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;Solution s;auto r=s.generateParenthesis(n);cout<<"[";for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"]"<<endl;}}`, 'unordered'],
  23: [LL + `\nint main(){int T;cin>>T;while(T--){int k;cin>>k;vector<ListNode*>ls(k);for(int i=0;i<k;i++){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;ls[i]=B(a);}Solution s;P(s.mergeKLists(ls));}}`, 'exact'],
  24: [dLL('swapPairs'), 'exact'],
  25: [dLLk('reverseKGroup'), 'exact'],
  26: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;Solution s;cout<<s.removeDuplicates(v)<<endl;}}`, 'exact'],
  27: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;int val;cin>>val;Solution s;cout<<s.removeElement(v,val)<<endl;}}`, 'exact'],
  28: [`int main(){int T;cin>>T;cin.ignore();while(T--){string a,b;getline(cin,a);getline(cin,b);Solution s;cout<<s.strStr(a,b)<<endl;}}`, 'exact'],
  29: [`int main(){int T;cin>>T;while(T--){long long a,b;cin>>a>>b;Solution s;cout<<s.divide((int)a,(int)b)<<endl;}}`, 'exact'],
  30: [`int main(){int T;cin>>T;cin.ignore();while(T--){string s;getline(cin,s);int n;cin>>n;cin.ignore();vector<string>w(n);for(int i=0;i<n;i++)getline(cin,w[i]);Solution sol;auto r=sol.findSubstring(s,w);sort(r.begin(),r.end());cout<<"[";for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"]"<<endl;}}`, 'sorted'],
  31: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;Solution s;s.nextPermutation(v);cout<<"[";for(int i=0;i<n;i++){if(i)cout<<",";cout<<v[i];}cout<<"]"<<endl;}}`, 'exact'],
  32: [dS_Int('longestValidParentheses'), 'exact'],
  33: [dViT_Int('search'), 'exact'],
  34: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;int t;cin>>t;Solution s;auto r=s.searchRange(v,t);cout<<"["<<r[0]<<","<<r[1]<<"]"<<endl;}}`, 'exact'],
  35: [dViT_Int('searchInsert'), 'exact'],
  38: [dI_Str('countAndSay'), 'exact'],
  39: [dViT_VVi('combinationSum'), 'unordered'],
  40: [dViT_VVi('combinationSum2'), 'unordered'],
  41: [dVi_Int('firstMissingPositive'), 'exact'],
  42: [dVi_Int('trap'), 'exact'],
  43: [d2S_Str('multiply'), 'exact'],
  44: [`int main(){int T;cin>>T;cin.ignore();while(T--){string s,p;getline(cin,s);getline(cin,p);Solution sol;cout<<(sol.isMatch(s,p)?"true":"false")<<endl;}}`, 'exact'],
  45: [dVi_Int('jump'), 'exact'],
  46: [dVi_VVi('permute'), 'unordered'],
  47: [dVi_VVi('permuteUnique'), 'unordered'],
  48: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<vector<int>>m(n,vector<int>(n));for(int i=0;i<n;i++)for(int j=0;j<n;j++)cin>>m[i][j];Solution s;s.rotate(m);cout<<"[";for(int i=0;i<n;i++){if(i)cout<<",";cout<<"[";for(int j=0;j<n;j++){if(j)cout<<",";cout<<m[i][j];}cout<<"]";}cout<<"]"<<endl;}}`, 'exact'],
  49: [`int main(){int T;cin>>T;cin.ignore();while(T--){int n;cin>>n;cin.ignore();vector<string>v(n);for(int i=0;i<n;i++)getline(cin,v[i]);Solution s;cout<<(int)s.groupAnagrams(v).size()<<endl;}}`, 'exact'],
  50: [`int main(){int T;cin>>T;while(T--){double x;int n;cin>>x>>n;Solution s;cout<<fixed<<setprecision(5)<<s.myPow(x,n)<<endl;}}`, 'float'],
  51: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;Solution s;cout<<(int)s.solveNQueens(n).size()<<endl;}}`, 'exact'],
  52: [dI_Int('totalNQueens'), 'exact'],
  53: [dVi_Int('maxSubArray'), 'exact'],
  54: [`int main(){int T;cin>>T;while(T--){int m,n;cin>>m>>n;vector<vector<int>>g(m,vector<int>(n));for(int i=0;i<m;i++)for(int j=0;j<n;j++)cin>>g[i][j];Solution s;auto r=s.spiralOrder(g);cout<<"[";for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"]"<<endl;}}`, 'exact'],
  55: [dVi_Bool('canJump'), 'exact'],
  56: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<vector<int>>iv(n,vector<int>(2));for(int i=0;i<n;i++)cin>>iv[i][0]>>iv[i][1];Solution s;auto r=s.merge(iv);cout<<"[";for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<"["<<r[i][0]<<","<<r[i][1]<<"]";}cout<<"]"<<endl;}}`, 'exact'],
  57: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<vector<int>>iv(n,vector<int>(2));for(int i=0;i<n;i++)cin>>iv[i][0]>>iv[i][1];int a,b;cin>>a>>b;Solution s;auto r=s.insert(iv,{a,b});cout<<"[";for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<"["<<r[i][0]<<","<<r[i][1]<<"]";}cout<<"]"<<endl;}}`, 'exact'],
  58: [dSl_Int('lengthOfLastWord'), 'exact'],
  59: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;Solution s;auto r=s.generateMatrix(n);cout<<"[";for(int i=0;i<n;i++){if(i)cout<<",";cout<<"[";for(int j=0;j<n;j++){if(j)cout<<",";cout<<r[i][j];}cout<<"]";}cout<<"]"<<endl;}}`, 'exact'],
  60: [d2I_Int('getPermutation'), 'exact'],
  61: [dLLk('rotateRight'), 'exact'],
  62: [d2I_Int('uniquePaths'), 'exact'],
  63: [`int main(){int T;cin>>T;while(T--){int m,n;cin>>m>>n;vector<vector<int>>g(m,vector<int>(n));for(int i=0;i<m;i++)for(int j=0;j<n;j++)cin>>g[i][j];Solution s;cout<<s.uniquePathsWithObstacles(g)<<endl;}}`, 'exact'],
  64: [`int main(){int T;cin>>T;while(T--){int m,n;cin>>m>>n;vector<vector<int>>g(m,vector<int>(n));for(int i=0;i<m;i++)for(int j=0;j<n;j++)cin>>g[i][j];Solution s;cout<<s.minPathSum(g)<<endl;}}`, 'exact'],
  65: [dS_Bool('isNumber'), 'exact'],
  66: [dVi_Vi('plusOne'), 'exact'],
  67: [d2S_Str('addBinary'), 'exact'],
  69: [dI_Int('mySqrt'), 'exact'],
  70: [dI_Int('climbStairs'), 'exact'],
  71: [dSl_Str('simplifyPath'), 'exact'],
  72: [d2S_Int('minDistance'), 'exact'],
  73: [`int main(){int T;cin>>T;while(T--){int m,n;cin>>m>>n;vector<vector<int>>g(m,vector<int>(n));for(int i=0;i<m;i++)for(int j=0;j<n;j++)cin>>g[i][j];Solution s;s.setZeroes(g);cout<<"[";for(int i=0;i<m;i++){if(i)cout<<",";cout<<"[";for(int j=0;j<n;j++){if(j)cout<<",";cout<<g[i][j];}cout<<"]";}cout<<"]"<<endl;}}`, 'exact'],
  74: [`int main(){int T;cin>>T;while(T--){int m,n;cin>>m>>n;vector<vector<int>>g(m,vector<int>(n));for(int i=0;i<m;i++)for(int j=0;j<n;j++)cin>>g[i][j];int t;cin>>t;Solution s;cout<<(s.searchMatrix(g,t)?"true":"false")<<endl;}}`, 'exact'],
  75: [dViVoid('sortColors'), 'exact'],
  76: [d2S_Str('minWindow'), 'exact'],
  77: [`int main(){int T;cin>>T;while(T--){int n,k;cin>>n>>k;Solution s;cout<<(int)s.combine(n,k).size()<<endl;}}`, 'exact'],
  78: [dVi_Cnt('subsets'), 'exact'],
  79: [`int main(){int T;cin>>T;cin.ignore();while(T--){int m,n;cin>>m>>n;cin.ignore();vector<vector<char>>b(m,vector<char>(n));for(int i=0;i<m;i++){string l;getline(cin,l);for(int j=0;j<n;j++)b[i][j]=l[j];}string w;getline(cin,w);Solution s;cout<<(s.exist(b,w)?"true":"false")<<endl;}}`, 'exact'],
  80: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;Solution s;cout<<s.removeDuplicates(v)<<endl;}}`, 'exact'],
  81: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>v(n);for(auto&x:v)cin>>x;int t;cin>>t;Solution s;cout<<(s.search(v,t)?"true":"false")<<endl;}}`, 'exact'],
  82: [dLL('deleteDuplicates'), 'exact'],
  83: [dLL('deleteDuplicates'), 'exact'],
  84: [dVi_Int('largestRectangleArea'), 'exact'],
  85: [`int main(){int T;cin>>T;cin.ignore();while(T--){int m,n;cin>>m>>n;cin.ignore();vector<vector<char>>g(m,vector<char>(n));for(int i=0;i<m;i++){string l;getline(cin,l);for(int j=0;j<n;j++)g[i][j]=l[j];}Solution s;cout<<s.maximalRectangle(g)<<endl;}}`, 'exact'],
  86: [LL + `\nint main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;int x;cin>>x;Solution s;P(s.partition(B(a),x));}}`, 'exact'],
  87: [d2S_Bool('isScramble'), 'exact'],
  88: [`int main(){int T;cin>>T;while(T--){int m,n;cin>>m>>n;vector<int>a(m+n,0);for(int i=0;i<m;i++)cin>>a[i];vector<int>b(n);for(auto&x:b)cin>>x;Solution s;s.merge(a,m,b,n);cout<<"[";for(int i=0;i<m+n;i++){if(i)cout<<",";cout<<a[i];}cout<<"]"<<endl;}}`, 'exact'],
  89: [`int main(){int T;cin>>T;while(T--){int n;cin>>n;Solution s;auto r=s.grayCode(n);cout<<"[";for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"]"<<endl;}}`, 'exact'],
  90: [dVi_Cnt('subsetsWithDup'), 'exact'],
  91: [dS_Int('numDecodings'), 'exact'],
  92: [LL + `\nint main(){int T;cin>>T;while(T--){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;int l,r;cin>>l>>r;Solution s;P(s.reverseBetween(B(a),l,r));}}`, 'exact'],
  93: [`int main(){int T;cin>>T;while(T--){string s;cin>>s;Solution sol;auto r=sol.restoreIpAddresses(s);cout<<"[";for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"]"<<endl;}}`, 'unordered'],
  94: [dTree_Vi('inorderTraversal'), 'exact'],
  96: [dI_Int('numTrees'), 'exact'],
  97: [`int main(){int T;cin>>T;while(T--){string a,b,c;cin>>a>>b>>c;Solution s;cout<<(s.isInterleave(a,b,c)?"true":"false")<<endl;}}`, 'exact'],
  98: [dTree_Bool('isValidBST'), 'exact'],
  100: [d2Tree_Bool('isSameTree'), 'exact'],
};

const SKIP = new Set([36, 37, 68, 95, 99]);

// ─── Main ──────────────────────────────────────────────
async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }

  await mongoose.connect(uri);
  console.log('Connected\n');

  const file = path.join(__dirname, '..', 'data', 'testcases.json');
  const problems = loadFile(file);
  console.log(`Loaded ${problems.length} problems from file\n`);

  const col = mongoose.connection.collection('testcases');
  let seeded = 0;

  for (const p of problems) {
    const pid = p.problem_id;
    if (SKIP.has(pid)) { console.log(`⏭️  #${pid} (skipped)`); continue; }
    if (!DRIVERS[pid]) { console.log(`⏭️  #${pid} (no driver)`); continue; }
    if (!CONV[pid]) { console.log(`⏭️  #${pid} (no converter)`); continue; }

    const [driver, compareMode] = DRIVERS[pid];
    const convert = CONV[pid];

    const tests: any[] = [];
    for (const t of p.tests) {
      const expected = fmtE(t.expected);
      if (!expected) continue;
      try {
        const input = convert(t.input);
        if (input === null) continue;
        tests.push({ input, expected, level: 1 });
      } catch { /* skip malformed */ }
    }

    if (!tests.length) { console.log(`⏭️  #${pid} (no valid tests)`); continue; }

    await col.updateOne(
      { problemId: pid },
      { $set: { problemId: pid, driver, compareMode, tests } },
      { upsert: true },
    );
    console.log(`✅ #${pid} (${tests.length} tests)`);
    seeded++;
  }

  console.log(`\nDone! Seeded ${seeded} problems.`);
  await mongoose.disconnect();
}

main().catch(console.error);
