npm run convert;

p1wins=0;
for i in $(seq 1 $3);
do
    echo -ne "round $i/$3\\r"
    node dynamite-cli.js dist/bots/$1.js dist/bots/$2.js > "tempBattleResult.txt";
    if grep -q "Winner: p1" "tempBattleResult.txt"; then 
        p1wins=$((p1wins + 1)); 
    fi
done

echo;
p2wins=$(($3 - p1wins));

echo "$1: $p1wins - $p2wins: $2";
